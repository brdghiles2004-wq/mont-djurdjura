
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DevisController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicSeoController;
use App\Http\Controllers\Api\PublicSettingController;
use App\Http\Controllers\Api\PublicProductController;

use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\DevisRequestController;
use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\EmailController;
use App\Http\Controllers\Api\Admin\GalleryController;
use App\Http\Controllers\Api\Admin\ClientController;
use App\Http\Controllers\Api\Admin\SiteSeoSettingController;
use App\Http\Controllers\Api\Admin\SeoPageController;
use App\Http\Controllers\Api\Admin\SiteSettingController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\AdminNotificationController;


/* =========================================
   TEMPORARY DEPLOYMENT DIAGNOSTIC
========================================= */

Route::get('/debug-runtime', function (Request $request) {
    return response()->json([
        'success' => true,
        'laravel' => app()->version(),
        'environment' => app()->environment(),
        'https' => $request->isSecure(),
        'session_driver' => config('session.driver'),
        'session_cookie' => config('session.cookie'),
        'session_domain' => config('session.domain'),
        'session_secure' => config('session.secure'),
        'session_same_site' => config('session.same_site'),
        'session_started' => app()->bound('session.store'),
        'sanctum_stateful' => config('sanctum.stateful'),
    ]);
});


/* =========================================
   PUBLIC API
========================================= */

// Health Check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'app' => 'Mont Djurdjura API',
        'status' => 'healthy',
    ]);
});

// Contact
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:10,1');

// Devis
Route::post('/devis', [DevisController::class, 'store'])
    ->middleware('throttle:10,1');

// Public Products
Route::get('/products', [PublicProductController::class, 'index']);
Route::get('/products/{slug}', [PublicProductController::class, 'show']);

// Gallery
Route::get('/gallery', [GalleryController::class, 'publicIndex']);

// SEO
Route::get('/seo/settings', [PublicSeoController::class, 'settings']);
Route::get('/seo/pages/{pageKey}', [PublicSeoController::class, 'page']);

// Settings
Route::get('/settings', [PublicSettingController::class, 'index']);


/* =========================================
   ADMIN AUTHENTICATION
========================================= */

Route::post('/admin/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');


/* =========================================
   PROTECTED ADMIN API
========================================= */

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    /* Authentication & Profile */

    Route::get('/user', [AuthController::class, 'user']);

    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'updatePassword']);

    Route::post('/logout', [AuthController::class, 'logout']);


    /* Dashboard */

    Route::get('/dashboard', [
        AdminDashboardController::class,
        'index',
    ]);


    /* Notifications */

    Route::get('/notifications', [
        AdminNotificationController::class,
        'index',
    ]);

    Route::patch('/notifications/{notification}/read', [
        AdminNotificationController::class,
        'markRead',
    ]);

    Route::patch('/notifications/read-all', [
        AdminNotificationController::class,
        'markAllRead',
    ]);


    /* Products */

    Route::get('/products', [ProductController::class, 'index'])
        ->middleware('permission:products.view');

    Route::post('/products', [ProductController::class, 'store'])
        ->middleware('permission:products.create');

    Route::get('/products/{product}', [ProductController::class, 'show'])
        ->middleware('permission:products.view');

    Route::match(['put', 'patch'], '/products/{product}', [ProductController::class, 'update'])
        ->middleware('permission:products.update');

    Route::delete('/products/{product}', [ProductController::class, 'destroy'])
        ->middleware('permission:products.delete');


    /* Categories */

    Route::get('/categories', [CategoryController::class, 'index'])
        ->middleware('permission:categories.view');

    Route::post('/categories', [CategoryController::class, 'store'])
        ->middleware('permission:categories.create');

    Route::get('/categories/{category}', [CategoryController::class, 'show'])
        ->middleware('permission:categories.view');

    Route::match(['put', 'patch'], '/categories/{category}', [CategoryController::class, 'update'])
        ->middleware('permission:categories.update');

    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->middleware('permission:categories.delete');


    /* Clients */

    Route::get('/clients', [ClientController::class, 'index'])
        ->middleware('permission:clients.view');

    Route::post('/clients', [ClientController::class, 'store'])
        ->middleware('permission:clients.create');

    Route::get('/clients/{client}', [ClientController::class, 'show'])
        ->middleware('permission:clients.view');

    Route::match(['put', 'patch'], '/clients/{client}', [ClientController::class, 'update'])
        ->middleware('permission:clients.update');

    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])
        ->middleware('permission:clients.delete');


    /* Devis */

    Route::get('/devis', [DevisRequestController::class, 'index'])
        ->middleware('permission:devis.view');

    Route::get('/devis/{devis}', [DevisRequestController::class, 'show'])
        ->middleware('permission:devis.view');

    Route::patch('/devis/{devis}', [DevisRequestController::class, 'update'])
        ->middleware('permission:devis.update');

    Route::post('/devis/{devis}/reply', [DevisRequestController::class, 'reply'])
        ->middleware('permission:devis.reply');


    /* Messages */

    Route::get('/messages', [ContactMessageController::class, 'index'])
        ->middleware('permission:messages.view');

    Route::get('/messages/{contactMessage}', [ContactMessageController::class, 'show'])
        ->middleware('permission:messages.view');

    Route::patch('/messages/{contactMessage}', [ContactMessageController::class, 'update'])
        ->middleware('permission:messages.update');

    Route::post('/messages/{contactMessage}/reply', [ContactMessageController::class, 'reply'])
        ->middleware('permission:messages.reply');


    /* Emails */

    Route::get('/emails', [EmailController::class, 'index'])
        ->middleware('permission:emails.view');

    Route::get('/emails/{email}', [EmailController::class, 'show'])
        ->middleware('permission:emails.view');

    Route::post('/emails/{email}/resend', [EmailController::class, 'resend'])
        ->middleware('permission:emails.resend');


    /* Gallery */

    Route::get('/gallery', [GalleryController::class, 'index'])
        ->middleware('permission:gallery.view');

    Route::post('/gallery', [GalleryController::class, 'store'])
        ->middleware('permission:gallery.create');

    Route::get('/gallery/{gallery}', [GalleryController::class, 'show'])
        ->middleware('permission:gallery.view');

    Route::match(['put', 'patch'], '/gallery/{gallery}', [GalleryController::class, 'update'])
        ->middleware('permission:gallery.update');

    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy'])
        ->middleware('permission:gallery.delete');


    /* SEO */

    Route::get('/seo/settings', [SiteSeoSettingController::class, 'show'])
        ->middleware('permission:seo.view');

    Route::put('/seo/settings', [SiteSeoSettingController::class, 'update'])
        ->middleware('permission:seo.update');

    Route::get('/seo/pages', [SeoPageController::class, 'index'])
        ->middleware('permission:seo.view');

    Route::put('/seo/pages/{pageKey}', [SeoPageController::class, 'update'])
        ->middleware('permission:seo.update');


    /* Settings */

    Route::get('/settings', [SiteSettingController::class, 'show'])
        ->middleware('permission:settings.view');

    Route::put('/settings', [SiteSettingController::class, 'update'])
        ->middleware('permission:settings.update');


    /* Roles */

    Route::get('/roles', [RoleController::class, 'index'])
        ->middleware('permission:roles.view');

    Route::post('/roles', [RoleController::class, 'store'])
        ->middleware('permission:roles.create');

    Route::put('/roles/{role}', [RoleController::class, 'update'])
        ->middleware('permission:roles.update');

    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);


    /* Users */

    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:users.view');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:users.create');

    Route::put('/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:users.update');

    Route::delete('/users/{user}', [UserController::class, 'destroy']);

});
