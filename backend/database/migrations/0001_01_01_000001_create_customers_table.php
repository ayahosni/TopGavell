<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number');
            $table->text('address');
            $table->timestamp('email_verified_at')->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('document_type', ['Passport', 'ID', 'Driving License'])->nullable();
            $table->string('document_file')->nullable();
            $table->enum('kyc_status', ['Pending','Approved', 'Rejected'])->default('Pending');
            $table->enum('verification_status', ['Verified', 'Not Verified'])->default('Not Verified');
            $table->timestamp('kyc_verification_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
