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

interface Column {
  id: 'date' | 'wheather' | 'text';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: string) => string;
}

const columns: Column[] = [
  { id: 'date', label: '日付', minWidth: 10 },
  { id: 'wheather', label: '天気', minWidth: 70 },
  { id: 'text', label: '本文', minWidth: 170, format: (value: string) => value.slice(0, 50) }
];

type RawDiary = {
  date: string,
  wheather: number,
  text: string
};
type Diary = {
  date: string,
  wheather: string,
  text: string
};
function createRow({ date, wheather, text }: RawDiary): Diary {
  date = new Date(date).toLocaleString();
  let tempW: string = '';
  switch(wheather) {
    case 0:
      tempW = '☀';
      break;
    case 1:
      tempW = '☁';
      break;
    case 2:
      tempW = '☂';
      break;
    case 3:
      tempW = '⚡';
      break;
    case 4:
      tempW = '⛄';
      break;
    case 5:
      tempW = '🌬';
      break;
    default:
      tempW = '☀';
  }

  return {
    date, wheather: tempW, text
  }
}

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
      const rawDiaries: RawDiary[] = (await res.json()).diaries;
      setRow(rawDiaries.map(createRow));
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
                  key={row.date}
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
      <DiaryModal diary={selected} isOpen={open} onClose={handleModalClose}/>
    </Paper>
  );
}
