<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdmin extends Command
{
    protected $signature = 'admin:create-super-admin';

    protected $description = 'Create the first administrator account';

    public function handle(): int
    {
        $superAdminRole = Role::where('slug', 'super_admin')->first();

        if (! $superAdminRole) {
            $this->error('Super Admin role does not exist.');
            $this->line('Run: php artisan db:seed --class=RolePermissionSeeder');

            return self::FAILURE;
        }

        $name = trim($this->ask('Admin name'));

        if ($name === '') {
            $this->error('Name is required.');

            return self::FAILURE;
        }

        $email = strtolower(trim($this->ask('Admin email')));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email address.');

            return self::FAILURE;
        }

        if (User::where('email', $email)->exists()) {
            $this->error('This email already exists.');

            return self::FAILURE;
        }

        $password = $this->secret('Enter password (minimum 12 characters)');
        $confirmation = $this->secret('Confirm password');

        if (
            ! is_string($password) ||
            strlen($password) < 12 ||
            ! is_string($confirmation) ||
            $password !== $confirmation
        ) {
            $this->error('Password must be at least 12 characters and both entries must match.');

            return self::FAILURE;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        $user->roles()->sync([$superAdminRole->id]);

        $this->newLine();
        $this->info('Super Admin account created successfully.');
        $this->line('Email: ' . $email);
        $this->line('Role: Super Admin');

        return self::SUCCESS;
    }
}
