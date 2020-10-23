import React, { useEffect } from 'react';
import { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { Diary, decodeWheather, decodeFeeling } from '../model/Diary';

type Column = {
  id: 'date' | 'wheather' | 'feeling' | 'text';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: any) => string;
};

const columns: Column[] = [
  { id: 'date', label: 'Date', minWidth: 20, format: (value: Date) => value.toLocaleString() },
  { id: 'wheather', label: 'Weather', minWidth: 20, format: (value: number) => decodeWheather(value) },
  { id: 'feeling', label: 'Feelings', minWidth: 20, format: (value: number) => decodeFeeling(value) },
  { id: 'text', label: 'Export', minWidth: 170, format: (value: string) => value.slice(0, 50) + '...' }
];

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  container: {
    height: 'calc(100vh - 110px)'
  },
  pagment: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fafafa',
    borderTop: '1px solid rgba(0, 0, 0, 0.15)',
    width: '100%',
    margin: 0
  },
  row: {
    cursor: 'pointer'
  }
});

type DiaryList = {
  diaries: Diary[];
  onSelected: (target: Diary) => void;
  pageReset: boolean;
};
export default function DiaryList({ diaries, onSelected, pageReset }: DiaryList) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }, []);

  useEffect(() => {
    pageReset ? setPage(0) : void(0);
  }, [pageReset]);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {diaries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((diary) => {
              return (
                <TableRow
                  className={classes.row}
                  key={diary.diary_id}
                  hover 
                  role="checkbox" 
                  tabIndex={-1}
                  onClick={(event) => onSelected(diary)}
                >
                  {columns.map((column) => {
                    const value = diary[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={classes.pagment}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={diaries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
