<?php

namespace App\Services;

use App\Models\EmailLog;
use Illuminate\Support\Facades\Mail;
use Throwable;

class EmailLogService
{
    /**
     * Send a plain-text email and record the attempt.
     */
    public function sendRaw(array $data): EmailLog
    {
        $log = EmailLog::create([
            'recipient' => $data['recipient'],
            'cc' => $data['cc'] ?? null,
            'bcc' => $data['bcc'] ?? null,
            'subject' => $data['subject'],
            'body_text' => $data['body'],
            'type' => $data['type'] ?? 'custom',
            'status' => 'pending',
            'related_type' => $data['related_type'] ?? null,
            'related_id' => $data['related_id'] ?? null,
            'created_by' => $data['created_by'] ?? auth()->id(),
            'metadata' => array_filter([
                'reply_to' => $data['reply_to'] ?? null,
                ...($data['metadata'] ?? []),
            ], fn ($value) => $value !== null),
        ]);

        $log->update([
            'attempt_count' => 1,
            'last_attempt_at' => now(),
        ]);

        try {
            $sentMessage = Mail::raw(
                $data['body'],
                function ($mail) use ($data) {
                    $mail->to($data['recipient'])
                        ->subject($data['subject']);

                    if (!empty($data['cc'])) {
                        $mail->cc($data['cc']);
                    }

                    if (!empty($data['bcc'])) {
                        $mail->bcc($data['bcc']);
                    }

                    if (!empty($data['reply_to']['email'])) {
                        $mail->replyTo(
                            $data['reply_to']['email'],
                            $data['reply_to']['name'] ?? null
                        );
                    }
                }
            );

            $log->update([
                'status' => 'sent',
                'sent_at' => now(),
                'error_message' => null,
                'message_id' => $this->extractMessageId($sentMessage),
            ]);
        } catch (Throwable $exception) {
            $log->update([
                'status' => 'failed',
                'error_message' => mb_substr(
                    $exception->getMessage(),
                    0,
                    60000
                ),
            ]);

            throw $exception;
        }

        return $log->fresh();
    }

    /**
     * Retry an existing failed email without creating a new log.
     */
    public function resend(EmailLog $log): EmailLog
    {
        if ($log->status !== 'failed') {
            throw new \RuntimeException(
                'Only failed emails can be resent.'
            );
        }

        $log->update([
            'status' => 'pending',
            'attempt_count' => $log->attempt_count + 1,
            'last_attempt_at' => now(),
            'error_message' => null,
        ]);

        try {
            $replyTo = $log->metadata['reply_to'] ?? null;

            $sentMessage = Mail::raw(
                $log->body_text ?? '',
                function ($mail) use ($log, $replyTo) {
                    $mail->to($log->recipient)
                        ->subject($log->subject);

                    if (!empty($log->cc)) {
                        $mail->cc($log->cc);
                    }

                    if (!empty($log->bcc)) {
                        $mail->bcc($log->bcc);
                    }

                    if (!empty($replyTo['email'])) {
                        $mail->replyTo(
                            $replyTo['email'],
                            $replyTo['name'] ?? null
                        );
                    }
                }
            );

            $log->update([
                'status' => 'sent',
                'sent_at' => now(),
                'error_message' => null,
                'message_id' => $this->extractMessageId($sentMessage)
                    ?? $log->message_id,
            ]);
        } catch (Throwable $exception) {
            $log->update([
                'status' => 'failed',
                'error_message' => mb_substr(
                    $exception->getMessage(),
                    0,
                    60000
                ),
            ]);

            throw $exception;
        }

        return $log->fresh();
    }

    /**
     * Extract the provider message ID when available.
     */
    private function extractMessageId(mixed $sentMessage): ?string
    {
        if (!$sentMessage) {
            return null;
        }

        if (method_exists($sentMessage, 'getSymfonySentMessage')) {
            $symfonyMessage = $sentMessage->getSymfonySentMessage();
            $originalMessage = $symfonyMessage->getOriginalMessage();

            if (method_exists($originalMessage, 'getHeaders')) {
                $header = $originalMessage
                    ->getHeaders()
                    ->get('X-Resend-Email-ID');

                if ($header) {
                    return trim($header->getBodyAsString());
                }
            }
        }

        if (method_exists($sentMessage, 'getMessageId')) {
            return $sentMessage->getMessageId();
        }

        return null;
    }
}
