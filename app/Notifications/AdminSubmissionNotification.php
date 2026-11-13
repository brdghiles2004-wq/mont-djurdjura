<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdminSubmissionNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $submissionType,
        public string $title,
        public string $message,
        public string $target,
        public int $reference
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => $this->submissionType,
            'title' => $this->title,
            'message' => $this->message,
            'target' => $this->target,
            'reference' => $this->reference,
        ];
    }
}
