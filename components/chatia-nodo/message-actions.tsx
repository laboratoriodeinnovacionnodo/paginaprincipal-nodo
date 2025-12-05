"use client"

import { Copy, Share2, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react"
import { ActionButton } from "./action-button"

interface MessageActionsProps {
  messageId: string
  content: string
  onCopy: () => void
  onShare: () => void
  onDelete: () => void
}

export function MessageActions({ messageId, content, onCopy, onShare, onDelete }: MessageActionsProps) {
  return (
    <div className="flex items-center gap-1 mt-2">
      <ActionButton
        id={`copy-${messageId}`}
        icon={<Copy className="w-4 h-4 text-blue-500" />}
        onClick={onCopy}
        tooltip="Copiar"
      />
      <ActionButton
        id={`share-${messageId}`}
        icon={<Share2 className="w-4 h-4 text-blue-500" />}
        onClick={onShare}
        tooltip="Compartir"
      />
      <ActionButton
        id={`like-${messageId}`}
        icon={<ThumbsUp className="w-4 h-4 text-blue-500" />}
        onClick={() => {}}
        tooltip="Me gusta"
      />
      <ActionButton
        id={`dislike-${messageId}`}
        icon={<ThumbsDown className="w-4 h-4 text-blue-500" />}
        onClick={() => {}}
        tooltip="No me gusta"
      />
      <ActionButton
        id={`delete-${messageId}`}
        icon={<Trash2 className="w-4 h-4 text-blue-500" />}
        onClick={onDelete}
        tooltip="Eliminar"
      />
    </div>
  )
}
