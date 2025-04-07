import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Input, Checkbox, Button } from '@material-tailwind/react';

interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogin?: (email: string, password: string, rememberMe: boolean) => void;
  error?: string;
  isLoading?: boolean;
}

const LoginModal = ({ isOpen = false, onClose = () => {}, onLogin, error, isLoading = false }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    if (onLogin) {
      onLogin(email, password, rememberMe);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-[440px] mx-auto p-4">
        <Card className="w-full shadow-xl">
          <CardHeader variant="gradient" color="blue" className="mb-4 grid h-28 place-items-center">
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-5 px-8">
            <Input
              label="Email"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-blue-500"
            />
            <Input
              label="Password"
              type="password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-blue-500"
            />
            <div className="-ml-2.5">
              <Checkbox
                label="Remember Me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                color="blue"
                className="text-sm"
              />
            </div>
            {error && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <Typography variant="small" color="red" className="font-medium">
                  {error}
                </Typography>
              </div>
            )}
          </CardBody>
          <CardFooter className="pt-0 px-8 pb-8">
            <Button
              variant="gradient"
              color="blue"
              fullWidth
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 text-base shadow-md"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Don&apos;t have an account?
              <Typography
                as="a"
                href="#signup"
                variant="small"
                color="blue"
                className="ml-1 font-bold transition-colors hover:text-blue-700"
              >
                Sign up
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginModal;
