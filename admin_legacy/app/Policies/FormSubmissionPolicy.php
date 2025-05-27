<?php

namespace App\Policies;

use App\Models\FormSubmission;
use App\Models\User;

class FormSubmissionPolicy
{
    /**
     * Determine whether the user can view any form submissions.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view form_submissions');
    }

    /**
     * Determine whether the user can view a specific form submission.
     */
    public function view(User $user, FormSubmission $formSubmission): bool
    {
        return $user->hasPermissionTo('view form_submissions');
    }

    /**
     * Determine whether the user can create form submissions.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create form_submissions');
    }

    /**
     * Determine whether the user can update the form submission.
     */
    public function update(User $user, FormSubmission $formSubmission): bool
    {
        return $user->hasPermissionTo('edit form_submissions');
    }

    /**
     * Determine whether the user can delete the form submission.
     */
    public function delete(User $user, FormSubmission $formSubmission): bool
    {
        return $user->hasPermissionTo('delete form_submissions');
    }

    /**
     * Determine whether the user can restore a deleted form submission.
     */
    public function restore(User $user, FormSubmission $formSubmission): bool
    {
        return $user->hasPermissionTo('delete form_submissions');
    }

    /**
     * Determine whether the user can permanently delete the form submission.
     */
    public function forceDelete(User $user, FormSubmission $formSubmission): bool
    {
        return $user->hasPermissionTo('delete form_submissions');
    }
}
