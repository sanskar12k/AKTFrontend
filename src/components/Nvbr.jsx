import * as React from 'react';
import {IconButton, Box, Container, Slide, Menu, Avatar, Button, Tooltip, AppBar, Toolbar, Typography, CssBaseline, useScrollTrigger}from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {
  Link, useNavigate
} from "react-router-dom";
import api from '../pages/api';

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function HideAppBar(props: Props) {
  const pages = [['Home', '/'], ['Report', '/addReport'], ['Add Employee', '/create'], ['Employees', '/alluser']];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const [anchorElNav, setAnchorElNav] = React.useState();
  const [anchorElUser, setAnchorElUser] = React.useState();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navigate = useNavigate();
  const logout = async () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // const res = await api.post("/user/logout", {}, { withCredentials: true });
    const res = await api.post("/user/logout", {});
    console.log(res)
    if (res.status === 200) {
      console.log(res)
      navigate("/login")
      window.location.reload();
    }
    window.location.reload();
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  <MenuItem key={pages[0][0]} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center"><Link className='nav-link' to={pages[0][1]}>{pages[0][0]}</Link> </Typography>
                  </MenuItem>
                  {props.user && props.user.role !== 'Staff' && <MenuItem key={pages[1][0]} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center"><Link className='nav-link' to={pages[1][1]}>{pages[1][0]}</Link> </Typography>
                  </MenuItem>}
                  {props.user && props.user.role !== 'Staff' && props.user.role !== 'CompOper' && <MenuItem key={pages[2][0]} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center"><Link className='nav-link' to={pages[2][1]}>{pages[2][0]}</Link> </Typography>
                  </MenuItem>}
                  {props.user && props.user.role !== 'Staff' && props.user.role !== 'CompOper' && <MenuItem key={pages[3][0]} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center"><Link className='nav-link' to={pages[3][1]}>{pages[3][0]}</Link> </Typography>
                  </MenuItem>}
                </Menu>
              </Box>
              <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {/* {pages.map((page) => ( */}

                <Link className='nav-link' to={pages[0][1]}>
                  <Button
                    key={pages[0][0]}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  > {pages[0][0]}</Button></Link>



                {props.user && props.user.role !== 'Staff' && <Button
                  key={pages[1][0]}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Link className='nav-link' to={pages[1][1]}>{pages[1][0]}</Link>
                </Button>}
                {props.user && props.user.role !== 'Staff' && props.user.role !== 'CompOper' && <Button
                  key={pages[2][0]}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Link className='nav-link' to={pages[2][1]}>{pages[2][0]}</Link>
                </Button>
                }
                {props.user && props.user.role !== 'Staff' && props.user.role !== 'CompOper' && <Button
                  key={pages[3][0]}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Link className='nav-link' to={pages[3][1]}>{pages[3][0]}</Link>
                </Button>
                }
              </Box>

              {props.user && <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={props.user.fname} src="/static/images/avatar/5.jpg" />

                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* {settings.map((setting) => ( */}
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      <div variant="contained" onClick={logout}>Logout</div>
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      <Link className='nav-link' variant="contained" to={`/profile/${props.user._id}`}>Profile</Link>
                    </Typography>
                  </MenuItem>
                  {/* ))} */}

                </Menu>
              </Box>
              }
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Toolbar />

    </React.Fragment>
  );
}
