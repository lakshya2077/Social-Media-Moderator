import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FiMoon, FiSun, FiLogOut } from "react-icons/fi";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import ReviewPost from "./components/Review";

const API_URL = "http://localhost:3001/api";
const socket = io("http://localhost:3001", { autoConnect: true });

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const headerBg = useColorModeValue(
    "linear-gradient(90deg, #208fff 0%, #073f7d 100%)",
    "linear-gradient(90deg, #0a73e6 0%, #072a52 100%)"
  );

  const fetchQueue = useCallback(
    async (authToken) => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/posts/flagged`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch flagged posts", error);
        toast({
          title: "Could not fetch removed posts.",
          status: "error",
          duration: 2200,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      setToken(tokenFromUrl);
      toast({
        title: "Signed in.",
        status: "success",
        duration: 1800,
        position: "top-right",
      });
      window.history.replaceState({}, document.title, "/");
      fetchQueue(tokenFromUrl);
      return;
    }
    if (token) fetchQueue(token);
  }, [fetchQueue, toast, token]);

  useEffect(() => {
    const handleNewPost = (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
      toast({
        title: "New post removed for review",
        status: "info",
        isClosable: true,
        duration: 2200,
        position: "top-right",
      });
    };
    socket.on("new_flagged_post", handleNewPost);
    return () => {
      socket.off("new_flagged_post", handleNewPost);
    };
  }, [toast]);

  const handleLoginSuccess = (authToken) => {
    localStorage.setItem("token", authToken);
    setToken(authToken);
    fetchQueue(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPosts([]);
    toast({
      title: "Logged out.",
      duration: 1500,
      position: "top-right",
    });
  };

  const decoded = useMemo(() => {
    if (!token) return {};
    try {
      return jwtDecode(token);
    } catch {
      return {};
    }
  }, [token]);

  if (!token) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const displayName = decoded.email || "Member";

  return (
    <Box minH="100vh">
      {/* Top Bar */}
      <Box
        position="sticky"
        top="0"
        zIndex="banner"
        bg={headerBg}
        boxShadow="sm"
      >
        <Container maxW="container.lg" py={3}>
          <Flex align="center">
            <HStack spacing={3}>
              <Text color="white" fontWeight="bold" fontSize="lg" letterSpacing="wide">
                Nova Moderator
              </Text>
              <Badge colorScheme="blackAlpha" bg="whiteAlpha.300" color="white" borderRadius="md">
                v2
              </Badge>
            </HStack>
            <Flex ml="auto" align="center" gap={2}>
              <Text color="white" fontSize="sm" opacity={0.9}>
                {displayName}
              </Text>
              <IconButton
                aria-label="Toggle color mode"
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.300" }}
                icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
                onClick={toggleColorMode}
              />
              <Button
                size="sm"
                variant="outline"
                color="white"
                borderColor="whiteAlpha.700"
                leftIcon={<FiLogOut />}
                _hover={{ bg: "whiteAlpha.300" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Body */}
      <Container maxW="container.lg" py={8}>
        <VStack align="stretch" spacing={6}>
          <Box
            borderWidth="1px"
            borderRadius="xl"
            bg="bg.card"
            borderColor="outline"
            boxShadow="sm"
            p={4}
          >
            <Tabs variant="enclosed" colorScheme="brand" isFitted>
              <TabList>
                <Tab>Compose & Feed</Tab>
                <Tab>
                  Removed Posts
                  {posts.length > 0 && (
                    <Badge ml={2} colorScheme="red" borderRadius="md">
                      {posts.length}
                    </Badge>
                  )}
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <Dashboard token={token} displayName={displayName} />
                </TabPanel>
                <TabPanel px={0}>
                  <ReviewPost
                    posts={posts}
                    setPosts={setPosts}
                    isLoading={isLoading}
                    token={token}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default App;
