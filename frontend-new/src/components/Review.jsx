import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { FiRefreshCw } from "react-icons/fi";
import { useCallback } from "react";

const API_URL = "http://localhost:3001/api";

const ReviewPost = ({ token, posts = [], setPosts = () => {}, isLoading = false }) => {
  const toast = useToast();

  const refresh = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/posts/flagged`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
      toast({
        title: "Queue refreshed.",
        status: "success",
        duration: 1500,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Failed to refresh queue.",
        status: "error",
        duration: 2000,
        position: "top-right",
      });
    }
  }, [token, setPosts, toast]);

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">Removed Posts ({posts.length})</Heading>
        <Button
          leftIcon={<FiRefreshCw />}
          variant="subtle"
          onClick={refresh}
          isDisabled={!token}
        >
          Refresh
        </Button>
      </HStack>

      {isLoading ? (
        <VStack spacing={4} align="stretch">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              variant="outline"
              borderLeft="4px solid"
              borderLeftColor="red.400"
            >
              <CardHeader>
                <Skeleton height="16px" w="40%" />
                <Skeleton height="12px" w="30%" mt={2} />
              </CardHeader>
              <CardBody>
                <SkeletonText noOfLines={3} spacing="3" />
              </CardBody>
            </Card>
          ))}
        </VStack>
      ) : posts.length === 0 ? (
        <Card variant="outline">
          <CardBody>
            <Text color="text.muted">
              No removed posts found.
            </Text>
          </CardBody>
        </Card>
      ) : (
        <VStack spacing={4} align="stretch">
          {posts.map((post) => (
            <Card
              key={post.id}
              variant="outline"
              borderLeft="4px solid"
              borderLeftColor="red.400"
              bg="bg.card"
            >
              <CardHeader pb={2}>
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={0}>
                    <Heading size="sm">
                      Post by: {post?.author?.email || "Unknown"}
                    </Heading>
                    <Text fontSize="xs" color="text.muted">
                      {new Date(post.createdAt).toLocaleString()}
                    </Text>
                  </VStack>
                  <Badge colorScheme="red" variant="subtle">
                    removed
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody pt={2}>
                {post.content && (
                  <Text mb={3} whiteSpace="pre-wrap">
                    {post.content}
                  </Text>
                )}

                {post.aiReason ? (
                  <VStack align="start" spacing={1}>
                    <Badge colorScheme="red">Reason</Badge>
                    <Text fontSize="sm" fontStyle="italic" color="text.muted">
                      {post.aiReason}
                    </Text>
                  </VStack>
                ) : (
                  <Text fontSize="sm" fontStyle="italic" color="text.muted">
                    This post was removed due to inappropriate content
                  </Text>
                )}
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ReviewPost;
