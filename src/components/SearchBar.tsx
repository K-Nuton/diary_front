import React, { useState } from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Button, FormControlLabel, Popover, Switch } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    filterIcon: {
      position: 'absolute',
      right: 0,
      height: '100%',
      padding: '0 12px'
    },
    popover: {
      padding: '12px',
    },
    popoverSearchButton: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }),
);

type DateSwitch = {
  date: Date;
  disabled: boolean;
  onChange: (date: MaterialUiPickersDate) => void;
  onDisabled: (disabled: boolean) => void;
}
type PrimarySearchAppBar = {
  onEnter: (input: string) => void;
  filter: {
    from: DateSwitch,
    to: DateSwitch,
    onClick: () => void;
  }
};
export default function PrimarySearchAppBar({ onEnter, filter }: PrimarySearchAppBar) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Your Name</MenuItem>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(null);
  
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const closeFilter = () => {
    filter.onClick();
    setFilterAnchor(null);
  };

  const handleFilterClose = () => setFilterAnchor(null);

  const filterOpen = Boolean(filterAnchor);
  const filterId = filterOpen ? 'filter-popover' : undefined;

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    filter.from.onDisabled(!event.target.checked);
    if (!event.target.checked)
      filter.to.onDisabled(!event.target.checked);
  };

  const handleToSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    filter.to.onDisabled(!event.target.checked);
  };

  const handleInputEnter = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if ('Enter' === event.key)
      onEnter((event.target as HTMLTextAreaElement).value);
  };


  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Web Diary
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              onKeyPress={handleInputEnter}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton 
              className={classes.filterIcon}
              aria-label="date-filter"
              aria-controls={filterId}
              aria-haspopup="true"
              color={!filter.from.disabled ? 'secondary' : 'inherit'}
              onClick={handleFilterClick}
            >
              <FilterListIcon />
            </IconButton>
            <Popover
              id={filterId}
              open={filterOpen}
              anchorEl={filterAnchor}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <div className={classes.popover}>
                <FormControlLabel 
                  control={
                    <Switch
                      checked={!filter.from.disabled}
                      onChange={handleSwitchChange}
                      color='primary'
                      name='switch date filter'
                      inputProps={{ 'aria-label': 'enable date filter' }}
                    />
                  }
                  label="enable date filter"
                />
                <div>
                  <DatePicker 
                    disabled={filter.from.disabled}
                    label="from"
                    variant='inline'
                    value={filter.from.date}
                    onChange={filter.from.onChange}
                    format='yyyy/MM/dd'
                    disableFuture
                  />
                  <div>
                    <Switch
                      disabled={filter.from.disabled}
                      checked={!filter.to.disabled}
                      onChange={handleToSwitchChange}
                      color="primary"
                      name="switch to date"
                      inputProps={{ 'aria-label': 'to date checkbox' }}
                    />
                    <DatePicker 
                      label="to"
                      variant='inline'
                      value={filter.to.date}
                      onChange={filter.to.onChange}
                      format='yyyy/MM/dd'
                      disableFuture
                      disabled={filter.to.disabled}
                      minDate={filter.from.date}
                    />
                  </div>
                </div>
                <div className={classes.popoverSearchButton} >
                  <Button
                    disabled={filter.from.disabled}
                    variant="contained" 
                    color='primary'
                    onClick={closeFilter}
                  >
                    検索
                  </Button>
                </div>
              </div>
            </Popover>
          </div>
          <div className={classes.grow} />
            <IconButton
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}