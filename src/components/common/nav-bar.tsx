import { AppBar, Box, Link, Toolbar, styled, Tooltip, IconButton, Button } from '@mui/material';
import { CircleUserRound, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/use-app-selector';
import SearchBar from './search-bar';
import { useEffect } from 'react';
import { getThemeColors } from '@/lib/muiTheme';
import { getCurrentUser, logoutUser } from '@/services/auth';
import { signIn, signOut } from '@/stores/user-slice';
import { useAppDispatch } from '@/hooks/use-app-dispatch';

const NavBarLink = styled(Link)(({ isActive }: { isActive?: boolean }) => ({
  underline: 'hover',
  fontSize: 15,
  lineHeight: '24px',
  textDecoration: 'none',
  textUnderlineOffset: 3,
  color: isActive ? '#F5E2CC' : '#FFFFFF',
  cursor: 'pointer',
  '&:hover': {
    color: '#F5E2CC',
    textDecoration: 'none',
  },
  '&.Mui-selected': {
    color: '#F5E2CC',
    fontWeight: '600',
    borderBottom: 'none',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
}));

const NavBar = () => {
  const colors = getThemeColors();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.user);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // const [isAuthenticate, setAuthenticate] = useState(false);

  // Check authentication status on component mount and location change
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      // setAuthenticate(!!user);
      if (token && !isAuthenticated) {
        // have token but not in redux, fetch user data
        const user = await getCurrentUser();
        if (user) {
          dispatch(signIn(user));
        } else {
          // token invalid, clear it
          localStorage.removeItem('access_token');
        }
      } else if (!token && isAuthenticated) {
        // no token but in redux, clear redux state
        dispatch(signOut());
      }
    };

    // Only check auth on mount and when navigating to/from auth pages
    if (
      pathname === '/sign-in' ||
      pathname === '/sign-up' ||
      pathname === '/profile' ||
      pathname === '/'
    ) {
      checkAuth();
    }
  }, [pathname, isAuthenticated, dispatch]);

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');

      // Clear Redux state first
      dispatch(signOut());

      // Clear localStorage
      await logoutUser();

      // Navigate using React Router
      navigate('/sign-in', { replace: true });

      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Logout failed:', error);

      // Fallback: force clear và navigate
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      dispatch(signOut());
      navigate('/sign-in', { replace: true });
    }
  };
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return (
      <AppBar
        elevation={0}
        sx={{
          position: 'fixed',
          top: 0,
          backgroundColor: '#391F06',
          justifyContent: 'center',
          height: { xs: '3rem', sm: '3.8rem' },
          border: 'none',
          borderWidth: '0px',
          borderStyle: 'none',
          outline: 'none',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 0,
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            paddingX: { xs: 3, sm: 4, md: 6, lg: 8 },
            justifyContent: 'center',
            flexWrap: 'wrap',
            minHeight: 'unset !important',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-start',

              alignItems: 'center',
              gap: { xs: 2, md: 4 },
            }}
          >
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
              onClick={e => {
                e.preventDefault();
                navigate('/');
              }}
            >
              <img src="/logo.svg" />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
  return (
    <AppBar
      elevation={0}
      sx={{
        position: 'fixed',
        top: 0,
        backgroundColor: '#391F06',
        justifyContent: 'center',
        height: { xs: '3rem', sm: '3.8rem' },
        border: 'none',
        borderWidth: '0px',
        borderStyle: 'none',
        outline: 'none',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: 0,
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          paddingX: { xs: 3, sm: 4, md: 6, lg: 8 },
          justifyContent: 'center',
          flexWrap: 'wrap',
          minHeight: 'unset !important',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-start',

            alignItems: 'center',
            gap: { xs: 2, md: 4 },
          }}
        >
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              cursor: 'pointer',
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
            }}
            onClick={e => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <img src="/logo.svg" />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <NavBarLink href="/" isActive={pathname === '/'}>
              Home
            </NavBarLink>
            <NavBarLink href="/explore" isActive={pathname === '/explore'}>
              Explore Recipe
            </NavBarLink>
            <NavBarLink href="/add-recipe" isActive={pathname === '/add-recipe'}>
              Add Recipe
            </NavBarLink>
            <SearchBar
              PlaceHolder="Search by dish, ingredient, or chef..."
              onSearch={query => {
                const trimmed = query.trim();
                const basePath = '/explore';
                if (trimmed) {
                  navigate(`${basePath}?q=${encodeURIComponent(trimmed)}`);
                } else {
                  navigate(basePath);
                }
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            justifyContent: 'flex-end',
            gap: 6,
          }}
        >
          {isAuthenticated ? (
            <>
              <Tooltip title="User profile">
                <IconButton
                  onClick={() => navigate('/profile')}
                  sx={{
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <CircleUserRound color="#EAC9A3" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Logout">
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <LogOut color="#EAC9A3" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                }}
              >
                {' '}
                <Button
                  onClick={() => navigate('/sign-up')}
                  variant="contained"
                  sx={{
                    backgroundColor: colors.background,
                    color: colors.primary,
                    border: `1px solid ${colors.background}`,
                    borderRadius: 0,
                    fontWeight: 500,
                    fontFamily: 'Montserrat',
                    textTransform: 'none',
                    padding: '3px 20px',
                    '&:hover': {
                      backgroundColor: colors.background,
                      opacity: 0.9,
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  onClick={() => navigate('/sign-in')}
                  variant="outlined"
                  sx={{
                    backgroundColor: 'transparent',
                    color: colors.background,
                    border: `1px solid ${colors.background}`,
                    borderRadius: 0,
                    fontWeight: 500,
                    fontFamily: 'Montserrat',
                    textTransform: 'none',
                    padding: '3px 20px',
                    '&:hover': {
                      backgroundColor: colors.background,
                      color: colors.primary,
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Log In
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
