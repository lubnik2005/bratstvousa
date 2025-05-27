<?php

namespace App\Policies;

use App\Models\ChildrensNewsArticle;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ChildrensNewsArticlePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view childrens_news_article');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ChildrensNewsArticle $childrensNewsArticle): bool
    {
        return $user->hasPermissionTo('view childrens_news_article');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create childrens_news_article');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ChildrensNewsArticle $childrensNewsArticle): bool
    {
        return $user->hasPermissionTo('edit childrens_news_article');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ChildrensNewsArticle $childrensNewsArticle): bool
    {
        return $user->hasPermissionTo('delete childrens_news_article');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ChildrensNewsArticle $childrensNewsArticle): bool
    {
        // If you'd like a separate permission for restore, update the permission here.
        // Otherwise, reuse the delete permission:
        return $user->hasPermissionTo('delete childrens_news_article');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ChildrensNewsArticle $childrensNewsArticle): bool
    {
        // If you'd like a separate permission for force delete, update the permission here.
        // Otherwise, reuse the delete permission:
        return $user->hasPermissionTo('delete childrens_news_article');
    }
}

