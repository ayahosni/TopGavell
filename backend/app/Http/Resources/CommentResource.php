<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'comment_id' => $this->id,
            'creator_name'=>$this->user->name,
            'content' => $this->comment_text,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

        ];    }
}