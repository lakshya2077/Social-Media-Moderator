import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Spacer,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiCamera, FiEdit, FiMoreHorizontal, FiTrash2 } from "react-icons/fi";

const API_URL = "http://localhost:3001/api";
const MAX_CHARS = 280;

const Dashboard = ({ token, displayName }) => {
  const toast = useToast();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // File or null
  const [previewUrl, setPreviewUrl] = useState(null); // string | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [feed, setFeed] = useState([]);
  const textareaRef = useRef(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderCol = useColorModeValue("gray.200", "gray.700");

  // Initial for avatar
  const firstLetter = useMemo(
    () => (displayName?.charAt(0)?.toUpperCase() || "M"),
    [displayName]
  );

  // Fetch posts
  const fetchAllPosts = useCallback(
    async (authToken) => {
      try {
        const res = await axios.get(`${API_URL}/posts`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setFeed(res.data);
      } catch (error) {
        toast({
          title: "Failed to fetch posts.",
          status: "error",
          duration: 2000,
          position: "top-right",
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    if (token) fetchAllPosts(token);
  }, [token, fetchAllPosts]);

  // Auto-resize textarea to fit content
  const handleInput = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setContent(val);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
  };

  // Manage preview URL for local file or existing remote URL
  useEffect(() => {
    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
    // When editing with existing URL (string) or cleared
    setPreviewUrl(image || null);
  }, [image]);

  // Create or Update post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast({
        title: "Content required",
        description: "Add text or an image before posting.",
        status: "warning",
        duration: 1800,
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      if (image instanceof File) {
        formData.append("image", image);
      }

      let res;
      if (editingPostId) {
        res = await axios.put(`${API_URL}/posts/${editingPostId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setFeed((prev) => prev.map((p) => (p.id === editingPostId ? res.data : p)));
        setEditingPostId(null);
      } else {
        res = await axios.post(`${API_URL}/posts`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setFeed((prev) => [res.data, ...prev]);
      }

      setContent("");
      setImage(null);
      setPreviewUrl(null);

      toast({
        title: editingPostId ? "Post updated!" : "Posted successfully!",
        status: "success",
        duration: 1600,
        position: "top-right",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not post content.",
        status: "error",
        duration: 2000,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = (postId) => {
    const post = feed.find((p) => p.id === postId);
    if (!post) return;
    setContent(post.content || "");
    setEditingPostId(postId);
    if (post.imageUrl) {
      setImage(post.imageUrl); // keep string so we don't re-upload unless changed
    } else {
      setImage(null);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeed((prev) => prev.filter((p) => p.id !== postId));

      if (editingPostId === postId) {
        setEditingPostId(null);
        setContent("");
        setImage(null);
        setPreviewUrl(null);
      }

      toast({
        title: "Post deleted",
        status: "success",
        duration: 1600,
        position: "top-right",
      });
    } catch {
      toast({
        title: "Error deleting post",
        status: "error",
        duration: 1800,
        position: "top-right",
      });
    }
  };

  const charsUsed = content.length;
  const usagePct = Math.min(100, Math.round((charsUsed / MAX_CHARS) * 100));
  const overLimit = charsUsed > MAX_CHARS;

  return (
    <Box>
      {/* Composer */}
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderCol}
        borderRadius="xl"
        p={4}
        boxShadow="sm"
      >
        <HStack align="start" spacing={3}>
          <Avatar name={firstLetter} size="sm" />
          <VStack w="100%" align="stretch" spacing={3}>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleInput}
              placeholder="Share an update..."
              resize="none"
              minH="84px"
            />

            {previewUrl && (
              <Box
                overflow="hidden"
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderCol}
              >
                <Image
                  src={previewUrl}
                  alt="preview"
                  objectFit="cover"
                  maxH="300px"
                  w="100%"
                />
              </Box>
            )}

            <HStack>
              <Button
                as="label"
                htmlFor="imageUpload"
                leftIcon={<FiCamera />}
                variant="subtle"
                size="sm"
              >
                Attach image
              </Button>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Spacer />
              <Text fontSize="sm" color={overLimit ? "red.400" : "gray.500"}>
                {charsUsed}/{MAX_CHARS}
              </Text>
              <Button
                onClick={handleCreatePost}
                isLoading={isSubmitting}
                isDisabled={!content.trim() && !previewUrl}
              >
                {editingPostId ? "Update" : "Post"}
              </Button>
            </HStack>

            <Progress
              value={usagePct}
              size="xs"
              colorScheme={overLimit ? "red" : "brand"}
              borderRadius="full"
            />
          </VStack>
        </HStack>
      </Box>

      {/* Feed */}
      <VStack spacing={4} align="stretch" mt={6}>
        {feed.length === 0 ? (
          <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderCol}
            borderRadius="xl"
            p={8}
            textAlign="center"
          >
            <Text color="gray.500">No posts yet. Be the first to share something.</Text>
          </Box>
        ) : (
          feed.map((post) => {
            const postAuthor = post?.author?.email || "Unknown";
            const authorInitial = postAuthor.charAt(0).toUpperCase();
            return (
              <Box
                key={post.id}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderCol}
                borderRadius="xl"
                p={4}
                boxShadow="xs"
              >
                <HStack align="start" spacing={3}>
                  <Avatar name={authorInitial} size="sm" />
                  <VStack align="stretch" spacing={2} w="100%">
                    <Flex align="center">
                      <HStack spacing={2}>
                        <Text fontWeight="semibold">{postAuthor}</Text>
                        {post?.aiReason && (
                          <Badge colorScheme="red" variant="subtle">
                            flagged
                          </Badge>
                        )}
                      </HStack>
                      <Spacer />
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<FiMoreHorizontal />}
                          variant="ghost"
                          size="sm"
                          isDisabled={postAuthor !== displayName}
                        />
                        <MenuList>
                          {postAuthor === displayName && (
                            <>
                              <MenuItem
                                icon={<FiEdit />}
                                onClick={() => handleEditPost(post.id)}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                icon={<FiTrash2 />}
                                onClick={() => handleDeletePost(post.id)}
                              >
                                Delete
                              </MenuItem>
                            </>
                          )}
                        </MenuList>
                      </Menu>
                    </Flex>

                    {post.content && <Text whiteSpace="pre-wrap">{post.content}</Text>}
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt="post"
                        borderRadius="md"
                        maxH="360px"
                        objectFit="cover"
                      />
                    )}

                    <Divider />
                  </VStack>
                </HStack>
              </Box>
            );
          })
        )}
      </VStack>
    </Box>
  );
};

export default Dashboard;
