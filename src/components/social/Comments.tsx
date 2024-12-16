// components/social/Comments.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Heart, Reply, 
  MoreVertical, Edit, Trash2, 
  Flag, Share2
} from 'lucide-react';
import type { UserProfile } from '@/types/user';

interface Comment {
  id: string;
  author: UserProfile;
  content: string;
  timestamp: number;
  likes: number;
  liked: boolean;
  replies: Comment[];
  edited?: boolean;
  reported?: boolean;
}

interface CommentsProps {
  comments: Comment[];
  currentUser?: UserProfile;
  onAddComment: (content: string, replyTo?: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onReportComment: (commentId: string) => Promise<void>;
}

export const Comments: React.FC<CommentsProps> = ({
  comments,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onReportComment
}) => {
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [editingComment, setEditingComment] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await onAddComment(newComment, replyingTo || undefined);
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await onEditComment(commentId, editContent);
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const CommentComponent: React.FC<{ comment: Comment; isReply?: boolean }> = ({ 
    comment, 
    isReply = false 
  }) => {
    const [showActions, setShowActions] = React.useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isReply ? 'ml-12' : ''}`}
      >
        <div className="flex space-x-4">
          {/* Author Avatar */}
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-medium">
                  {comment.author.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="flex-1">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-purple-900">
                    {comment.author.username}
                  </span>
                  <span className="text-sm text-purple-600 ml-2">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                  {comment.edited && (
                    <span className="text-sm text-purple-600 ml-2">
                      (edited)
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 rounded-lg hover:bg-purple-100"
                  >
                    <MoreVertical size={16} className="text-purple-600" />
                  </motion.button>

                  {/* Actions Dropdown */}
                  <AnimatePresence>
                    {showActions && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                                 border border-purple-100 py-1 z-10"
                      >
                        {currentUser?.address === comment.author.address && (
                          <>
                            <button
                              onClick={() => {
                                setEditingComment(comment.id);
                                setEditContent(comment.content);
                                setShowActions(false);
                              }}
                              className="w-full px-4 py-2 text-left text-purple-600 
                                       hover:bg-purple-50 flex items-center space-x-2"
                            >
                              <Edit size={16} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                onDeleteComment(comment.id);
                                setShowActions(false);
                              }}
                              className="w-full px-4 py-2 text-left text-red-600 
                                       hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            onReportComment(comment.id);
                            setShowActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-yellow-600 
                                   hover:bg-yellow-50 flex items-center space-x-2"
                        >
                          <Flag size={16} />
                          <span>Report</span>
                        </button>
                        <button
                          onClick={() => {
                            // Share functionality
                            setShowActions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-purple-600 
                                   hover:bg-purple-50 flex items-center space-x-2"
                        >
                          <Share2 size={16} />
                          <span>Share</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {editingComment === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-purple-200
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                      className="px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-purple-900 mt-2">{comment.content}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => onLikeComment(comment.id)}
                className={`flex items-center space-x-1 text-sm
                  ${comment.liked ? 'text-red-500' : 'text-purple-600 hover:text-red-500'}`}
              >
                <Heart size={16} fill={comment.liked ? 'currentColor' : 'none'} />
                <span>{comment.likes}</span>
              </button>
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
              >
                <Reply size={16} />
                <span>Reply</span>
              </button>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
                onSubmit={handleSubmit}
              >
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-4 py-2 rounded-lg bg-white border border-purple-200
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Reply
                  </button>
                </div>
              </motion.form>
            )}

            {/* Nested Replies */}
            {comment.replies.map((reply) => (
              <CommentComponent key={reply.id} comment={reply} isReply />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={4}
        />
        <div className="flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={!newComment.trim()}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white font-medium
                     hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            Post Comment
          </motion.button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};