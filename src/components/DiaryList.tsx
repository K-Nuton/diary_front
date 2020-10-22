import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import DiaryModal from './DiaryModal';

import { Diary, RawDiary, decodeWheather, decodeFeeling } from '../model/Diary';

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

function createRow({ 
  inner_user_id,
  diary_id,
  date,
  update_date,
  wheather,
  feeling,
  text
 }: RawDiary): Diary {
  return {
    inner_user_id,
    diary_id,
    date: new Date(date),
    update_date: new Date(update_date),
    wheather,
    feeling,
    text
  };
}

export default function DiaryList() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRow] = useState<Diary[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Diary | null>(null);

  useEffect(() => {
    (async () => {
      const res: Response = await fetch('../1000.json');
      const diaries: RawDiary[] = (await res.json()).diaries;
      setRow(diaries.map(createRow));
    })();
  }, []);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }, []);

  const handleModalClose = useCallback(() => setOpen(false), []);

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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow
                  className={classes.row}
                  key={row.diary_id}
                  hover 
                  role="checkbox" 
                  tabIndex={-1}
                  onClick={(event) => {
                    setSelected(row);
                    setOpen(true);
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <DiaryModal diary={selected} open={open} onClose={handleModalClose}/>
    </Paper>
  );
}
