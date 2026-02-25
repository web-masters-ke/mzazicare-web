"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { Button, Spinner } from '@/components/ui';
import { motion } from 'framer-motion';
import { useMessaging } from '@/hooks/useMessaging';
import { Message, MessageType } from '@/types/messaging';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Download,
  X,
} from 'lucide-react';

function MediaGalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { getMediaGallery } = useMessaging();

  const [media, setMedia] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'IMAGE' | 'FILE'>('all');
  const [selectedMedia, setSelectedMedia] = useState<Message | null>(null);

  const conversationId = searchParams.get('conversation');

  useEffect(() => {
    if (conversationId) {
      loadMedia();
    }
  }, [conversationId, selectedType]);

  const loadMedia = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      // TODO: Implement getMediaGallery in useMessaging hook
      // const mediaData = await getMediaGallery(conversationId, selectedType === 'all' ? undefined : selectedType as any);
      // setMedia(mediaData.data);
      setMedia([]);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download:', error);
      toast.error('Failed to download file');
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const images = media.filter((m) => m.type === MessageType.IMAGE);
  const files = media.filter((m) => m.type === MessageType.FILE);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Back to Messages
          </Button>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">
            Media Gallery
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            View all media files shared in this conversation
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white hover:bg-dark-200 dark:hover:bg-dark-700'
            }`}
          >
            All ({images.length + files.length})
          </button>
          <button
            onClick={() => setSelectedType('IMAGE')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              selectedType === 'IMAGE'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white hover:bg-dark-200 dark:hover:bg-dark-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Images ({images.length})
          </button>
          <button
            onClick={() => setSelectedType('FILE')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              selectedType === 'FILE'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white hover:bg-dark-200 dark:hover:bg-dark-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Files ({files.length})
          </button>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-dark-400" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              No media found
            </h3>
            <p className="text-dark-600 dark:text-dark-400">
              {selectedType === 'all'
                ? 'No media files have been shared in this conversation yet'
                : selectedType === 'IMAGE'
                ? 'No images have been shared in this conversation yet'
                : 'No files have been shared in this conversation yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((message) => {
              const attachment = message.attachments?.[0];
              if (!attachment) return null;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  {message.type === MessageType.IMAGE ? (
                    <button
                      onClick={() => setSelectedMedia(message)}
                      className="w-full aspect-square rounded-xl overflow-hidden bg-dark-100 dark:bg-dark-800"
                    >
                      <img
                        src={attachment}
                        alt="Media"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </button>
                  ) : (
                    <div className="w-full aspect-square rounded-xl bg-dark-100 dark:bg-dark-800 flex flex-col items-center justify-center p-4 group-hover:bg-dark-200 dark:group-hover:bg-dark-700 transition-colors">
                      <FileText className="w-12 h-12 text-primary-500 mb-2" />
                      <p className="text-xs text-dark-900 dark:text-white text-center truncate w-full">
                        {message.content || 'File'}
                      </p>
                    </div>
                  )}

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(attachment, `file-${message.id}`)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white dark:bg-dark-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 text-dark-900 dark:text-white" />
                  </button>

                  {/* Date */}
                  <p className="text-xs text-dark-500 mt-2 text-center">
                    {formatDate(message.createdAt)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-4xl w-full">
            <img
              src={selectedMedia.attachments?.[0]}
              alt="Full size"
              className="w-full h-auto rounded-2xl"
            />
            <div className="mt-4 bg-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-medium mb-1">
                    From {selectedMedia.sender.fullName}
                  </p>
                  <p className="text-white/60 text-sm">
                    {formatDate(selectedMedia.createdAt)}
                  </p>
                  {selectedMedia.content && (
                    <p className="text-white/80 mt-2">{selectedMedia.content}</p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() =>
                    handleDownload(
                      selectedMedia.attachments?.[0] || '',
                      `image-${selectedMedia.id}`
                    )
                  }
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MediaGalleryPage() {
  return (
    <ProtectedRoute>
      <MediaGalleryContent />
    </ProtectedRoute>
  );
}
