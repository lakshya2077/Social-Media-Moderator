import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useMemo, useState } from "react";
import { FiArrowRight, FiGithub } from "react-icons/fi";

const API_URL = "http://localhost:3001/api";

const AuthScreen = ({ onLoginSuccess }) => {
  const toast = useToast();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const title = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create account"),
    [mode]
  );
  const cta = useMemo(() => (mode === "login" ? "Sign in" : "Sign up"), [mode]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    if (!password.trim()) errs.password = "Password is required.";
    return errs;
  };

  const handleAuth = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      Object.values(errs).forEach((msg) =>
        toast({
          title: "Validation error",
          description: msg,
          status: "warning",
          duration: 1800,
          position: "top-right",
        })
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = mode === "login" ? "login" : "register";
      const res = await axios.post(`${API_URL}/auth/${endpoint}`, {
        email,
        password,
      });

      if (mode === "login") {
        toast({
          title: "Logged in",
          status: "success",
          duration: 1600,
          position: "top-right",
        });
        onLoginSuccess(res.data.token);
      } else {
        toast({
          title: "Registration successful",
          description: "Please sign in.",
          status: "success",
          duration: 1800,
          position: "top-right",
        });
        setMode("login");
      }
    } catch (err) {
      toast({
        title: "Authentication failed",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 2200,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <Box minH="100vh" display="grid" placeItems="center" px={4}>
      <Container maxW="5xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          overflow="hidden"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="outline"
          bg="bg.card"
          boxShadow="md"
        >
          {/* Left: Brand / Hero */}
          <Box
            flex="1"
            bgGradient={{
              base: "linear(to-b, brand.600, brand.800)",
              md: "linear(to-br, brand.600, brand.800)",
            }}
            color="white"
            p={{ base: 8, md: 10 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack spacing={4} align="start" maxW="sm">
              <Heading size="lg" lineHeight="1.2">
                Moderate smarter with a modern dashboard
              </Heading>
              <Text opacity={0.9}>
                Keep communities safe using streamlined tools for posting and reviewing flagged content in real time.
              </Text>
              <HStack spacing={3}>
                <Text fontSize="sm" opacity={0.85}>
                  OAuth ready
                </Text>
                <Divider orientation="vertical" borderColor="whiteAlpha.600" />
                <Text fontSize="sm" opacity={0.85}>
                  Realtime updates
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Right: Auth Card */}
          <Box flex="1" p={{ base: 6, md: 10 }}>
            <VStack spacing={6} align="stretch">
              <VStack align="start" spacing={1}>
                <Heading size="md">{title}</Heading>
                <Text color="text.muted" fontSize="sm">
                  {mode === "login"
                    ? "Enter credentials to access the moderator console."
                    : "Sign up to start moderating content."}
                </Text>
              </VStack>

              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                  {/* Inline field errors rendered via toasts to keep UI clean */}
                </FormControl>

                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Toggle password visibility"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword((s) => !s)}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage />
                </FormControl>

                <Button
                  onClick={handleAuth}
                  isLoading={isSubmitting}
                  rightIcon={<FiArrowRight />}
                >
                  {cta}
                </Button>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="text.muted">
                    {mode === "login" ? "New here?" : "Already have an account?"}
                  </Text>
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                  >
                    {mode === "login" ? "Create an account" : "Back to sign in"}
                  </Button>
                </HStack>

                <HStack align="center">
                  <Divider />
                  <Text fontSize="xs" color="text.muted" whiteSpace="nowrap">
                    Or continue with
                  </Text>
                  <Divider />
                </HStack>

                <Button
                  variant="glass"
                  onClick={handleGoogle}
                >
                  Continue with Google
                </Button>

                {/* Example: Keeping GitHub button available if needed in future */}
                <Button
                  leftIcon={<FiGithub />}
                  variant="subtle"
                  onClick={() =>
                    toast({
                      title: "GitHub OAuth not configured",
                      description: "This demo uses Google OAuth at /auth/google.",
                      status: "info",
                      duration: 1800,
                      position: "top-right",
                    })
                  }
                >
                  Continue with GitHub
                </Button>
              </VStack>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default AuthScreen;
