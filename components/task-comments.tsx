"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MessageCircle, Send, Reply, Heart, MoreHorizontal, Edit, Trash2, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Types
interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  createdAt: Date
  updatedAt?: Date
  likes: number
  isLiked: boolean
  replies: Comment[]
  attachments?: {
    id: string
    name: string
    url: string
    type: string
    size: number
  }[]
  mentions?: string[]
}

interface TaskCommentsProps {
  taskId: string
  comments: Comment[]
  onAddComment: (content: string, attachments?: File[], parentId?: string) => void
  onEditComment: (commentId: string, content: string) => void
  onDeleteComment: (commentId: string) => void
  onLikeComment: (commentId: string) => void
  currentUser: {
    id: string
    name: string
    avatar?: string
    role: string
  }
}

// Mock data
const mockComments: Comment[] = [
  {
    id: "1",
    content:
      "Great progress on this task! The UI design looks really clean. I have a few suggestions for the color scheme that might improve accessibility.",
    author: {
      id: "user-1",
      name: "Sarah Wilson",
      avatar: "/avatars/sarah.jpg",
      role: "Project Manager",
    },
    createdAt: new Date("2024-01-15T10:30:00"),
    likes: 3,
    isLiked: false,
    replies: [
      {
        id: "2",
        content:
          "Thanks for the feedback! Could you share those color suggestions? I'm always looking to improve accessibility.",
        author: {
          id: "user-2",
          name: "John Doe",
          avatar: "/avatars/john.jpg",
          role: "Developer",
        },
        createdAt: new Date("2024-01-15T11:15:00"),
        likes: 1,
        isLiked: true,
        replies: [],
        mentions: ["user-1"],
      },
    ],
    attachments: [
      {
        id: "att-1",
        name: "design-mockup.png",
        url: "/attachments/design-mockup.png",
        type: "image/png",
        size: 245760,
      },
    ],
  },
  {
    id: "3",
    content:
      "I've completed the backend integration. The API endpoints are ready for testing. @john.doe can you review the authentication flow?",
    author: {
      id: "user-3",
      name: "Alex Johnson",
      avatar: "/avatars/alex.jpg",
      role: "Backend Developer",
    },
    createdAt: new Date("2024-01-16T09:45:00"),
    likes: 2,
    isLiked: false,
    replies: [],
    mentions: ["user-2"],
  },
]

const mockCurrentUser = {
  id: "user-current",
  name: "Current User",
  avatar: "/avatars/current.jpg",
  role: "Developer",
}

export default function TaskComments({
  taskId,
  comments = mockComments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  currentUser = mockCurrentUser,
}: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    onAddComment(newComment, attachments, replyingTo || undefined)
    setNewComment("")
    setAttachments([])
    setReplyingTo(null)
  }

  const handleEditSubmit = (commentId: string) => {
    if (!editContent.trim()) return

    onEditComment(commentId, editContent)
    setEditingComment(null)
    setEditContent("")
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-12" : ""} mb-4`}>
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
          <AvatarFallback>
            {comment.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{comment.author.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {comment.author.role}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(comment.createdAt)}
                  {comment.updatedAt && " (edited)"}
                </span>
              </div>

              {comment.author.id === currentUser.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingComment(comment.id)
                        setEditContent(comment.content)
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteComment(comment.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {editingComment === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleEditSubmit(comment.id)}>
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingComment(null)
                      setEditContent("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>

                {/* Attachments */}
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {comment.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{attachment.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <button
              onClick={() => onLikeComment(comment.id)}
              className={`flex items-center space-x-1 hover:text-red-600 transition-colors ${
                comment.isLiked ? "text-red-600" : "text-gray-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`} />
              <span>{comment.likes}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 ml-8">
              <div className="flex space-x-3">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                    placeholder={`Reply to ${comment.author.name}...`}
                    className="min-h-[80px]"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null)
                          setNewComment("")
                        }}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSubmitComment}>
                        <Send className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">{comment.replies.map((reply) => renderComment(reply, true))}</div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* New Comment Form */}
        <div className="mb-6">
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[100px]"
              />

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach File
                  </Button>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
                </div>
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
