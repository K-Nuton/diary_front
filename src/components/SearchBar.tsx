import React, { useCallback, useRef, useState } from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FilterListIcon from '@material-ui/icons/FilterList';
import { FormControlLabel, Popover, Switch } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { downloadDiaries } from '../handlers/DownloadHandler';
import { SearchResponse } from '../utils/DiaryAPI';

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
export type Filter = {
  from: DateSwitch,
  to: DateSwitch
};
type PrimarySearchAppBar = {
  onEnter: (input: string) => void;
  filter: Filter;
  userInfo: {
    userName: string;
    onLogout: () => void;
  },
  json: SearchResponse
};
export default function SearchBar({ onEnter, filter, userInfo, json }: PrimarySearchAppBar) {
  const classes = useStyles();

  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(null);
  const filterOpen = Boolean(filterAnchor);
  const filterId = filterOpen ? 'filter-popover' : undefined;
  
  const handleFilterClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchor(event.currentTarget);
  }, [setFilterAnchor]);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleFilterClose = useCallback(() => {
    onEnter(inputRef.current ? inputRef.current.value : "");
    setFilterAnchor(null);
  }, [onEnter, setFilterAnchor]);

  const handleInputEnter = useCallback((event: React.KeyboardEvent<HTMLDivElement>): void => {
    if ('Enter' === event.key)
      onEnter(inputRef.current ? inputRef.current.value : "");
  }, [onEnter]);

  const handleDownloadClick = useCallback(() => downloadDiaries(json), [json]);
  
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
            <ImportContactsIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Web Diary
          </Typography>
          <div className={classes.search}>
            <SearchTextField 
              inputRef={inputRef}
              filterId={filterId}
              filterEnabled={!filter.from.disabled}
              onKeyPress={handleInputEnter}
              onFilterClick={handleFilterClick}
            />
            <DateRangeSwitcher 
              from={filter.from}
              to={filter.to}
              open={filterOpen}
              filterAnchor={filterAnchor}
              onClose={handleFilterClose}
              id={filterId}
            />
          </div>
          <IconButton color='inherit' onClick={handleDownloadClick}>
            <CloudDownloadIcon />
          </IconButton>
          <UserMenu userName={userInfo.userName} onLogout={userInfo.onLogout} />
        </Toolbar>
      </AppBar>
    </div>
  );
}

type SearchTextField = {
  onKeyPress: ((event: React.KeyboardEvent<HTMLDivElement>) => void) | undefined;
  onFilterClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  filterId: string | undefined;
  filterEnabled: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}
function SearchTextField({ onKeyPress, onFilterClick, filterId, filterEnabled, inputRef }: SearchTextField): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        inputRef={inputRef}
        placeholder="Search…"
        onKeyPress={onKeyPress}
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
        color={filterEnabled ? 'inherit' : 'secondary'}
        onClick={onFilterClick}
      >
        <FilterListIcon />
      </IconButton>
    </>
  );
}

type Switcher = {
  from: DateSwitch;
  to: DateSwitch;
  open: boolean;
  filterAnchor: HTMLButtonElement | null;
  onClose: () => any;
  id: string | undefined;
};
function DateRangeSwitcher({ from, to, open, filterAnchor, onClose, id }: Switcher): JSX.Element {
  const classes = useStyles();

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    from.onDisabled(!event.target.checked);
    if (!event.target.checked)
      to.onDisabled(!event.target.checked);
  };

  const handleToSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    to.onDisabled(!event.target.checked);
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={filterAnchor}
      onClose={onClose}
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
              checked={!from.disabled}
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
            disabled={from.disabled}
            label="from"
            variant='inline'
            value={from.date}
            onChange={from.onChange}
            format='yyyy/MM/dd'
            disableFuture
          />
          <div>
            <Switch
              disabled={from.disabled}
              checked={!to.disabled}
              onChange={handleToSwitchChange}
              color="primary"
              name="switch to date"
              inputProps={{ 'aria-label': 'to date checkbox' }}
            />
            <DatePicker 
              label="to"
              variant='inline'
              value={to.date}
              onChange={to.onChange}
              format='yyyy/MM/dd'
              disableFuture
              disabled={to.disabled}
              minDate={from.date}
            />
          </div>
        </div>
      </div>
    </Popover>
  );
}

type UserMenu = {
  userName: string;
  onLogout: () => void;
}
function UserMenu({ userName, onLogout }: UserMenu): JSX.Element {
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

  return (
    <>
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
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>{userName}</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
    </>
  )
}