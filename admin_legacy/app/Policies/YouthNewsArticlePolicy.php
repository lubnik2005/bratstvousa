<?php

namespace App\Policies;

use App\Models\User;
use App\Models\YouthNewsArticle;
use Illuminate\Auth\Access\Response;

class YouthNewsArticlePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view youth_news_article');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, YouthNewsArticle $youthNewsArticle): bool
    {
        return $user->hasPermissionTo('view youth_news_article');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create youth_news_article');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, YouthNewsArticle $youthNewsArticle): bool
    {
        return $user->hasPermissionTo('edit youth_news_article');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, YouthNewsArticle $youthNewsArticle): bool
    {
        return $user->hasPermissionTo('delete youth_news_article');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, YouthNewsArticle $youthNewsArticle): bool
    {
        return $user->hasPermissionTo('restore youth_news_article');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, YouthNewsArticle $youthNewsArticle): bool
    {
        return $user->hasPermissionTo('delete youth_news_article');
    }
}
