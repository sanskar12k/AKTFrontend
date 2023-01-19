import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridToolbarExport } from '@mui/x-data-grid';
import { useState, useEffect } from "react"
import api from './api'
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import Graph from './graph';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skelton from '../skeleton/dashboard';
import './table.css'
const columns: GridColDef[] = [
  {
    field: 'created',
    headerName: 'Date',
    width: 180
  },
  {
    field: 'store',
    headerName: 'Store',
    width: 180,
  },
  {
    field: 'sale',
    headerName: 'Sale',
    width: 180,
  },
  {
    field: 'customer',
    headerName: 'Customer',
    width: 150,
  },
  {
    field: 'paytm',
    headerName: 'Paytm',
    // type: 'number',
    width: 160,
  },
  {
    field: 'hdfc',
    headerName: 'HDFC',
    width: 170,
  },
  {
    field: 'addedName',
    headerName: 'Added by',
    width: 180
  }
];

function CustomToolbar() {
  return (
    <GridToolbarExport />
  );
}

export default function DataGridDemo(props) {
  const [saleO, setSale] = useState([]);
  const [xDataO, setX] = useState([]);
  const [yDataO, setY] = useState([]);
  const [saleN, setSaleN] = useState([]);
  const [xDataN, setXN] = useState([]);
  const [yDataN, setYN] = useState([]);
  const [param, setParam] = useState('sale');
  const [days, setDays] = useState(30);
  const [tableLoad, setLoad] = useState(false);
  const [store, setStore] = useState('AKT Old')
  const fetchSale = async () => {
    try {
      setLoad(true)
      const res = await api.get(`/user/sale`,
      {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':document.cookie
      },
      },{ withCredentials: true });
      if (res.status === 200) {
        // console.log('sdk')
        const data = await res.data;
        // console.log(data.report)
        let y = [];
        let x = [];
        if (data.reportOld?.length > 0 || data.reportNew?.length > 0) {
          data.reportOld = data.reportOld.slice(0, Math.min(days, data.reportOld.length))
          setSale(
            data.reportOld.map(e => {
              if (e.created) { e.created = new Date(e.created).toLocaleDateString(); }
              if (e.added) e.username = `${e.added.fname} ${e.added.lname}`

              x.push(e.created);
              y.push(e.sale);
              return { ...e }
            })
          )
          let xn = [];
          let yn = [];
          data.reportNew = data.reportNew.slice(0, Math.min(days, data.reportNew.length))
          setSaleN(
            data.reportNew.map(e => {
              if (e.created) { e.created = new Date(e.created).toLocaleDateString(); }
              // if (e.added) e.username = `${e.added.fname} ${e.added.lname}`

              xn.push(e.created);
              yn.push(e.sale);
              return { ...e }
            })
          )
          console.log(saleO)
          setX([...x]);
          setY([...y]);
          setXN([...xn]);
          setYN([...yn]);
          // console.log(sale)
        }
      }
      setLoad(false)
    }
    catch (e) { console.log(e) }
  }
  const makeGraphAxes = (param) => {
    let y = [];
    if (store === 'AKT Old') {
      saleO.map(e => {
        if (param === 'paytm') {
          y.push(e.paytm);
        }
        else if (param === 'customer') {
          y.push(e.customer)
        }
        else if (param === 'hdfc') {
          y.push(e.hdfc)
        }
        else {
          y.push(e.sale);
        }
      }

      )
      setY([...y]);
    }
    else {
      saleN.map(e => {
        if (param === 'paytm') {
          y.push(e.paytm);
        }
        else if (param === 'customer') {
          y.push(e.customer)
        }
        else if (param === 'hdfc') {
          y.push(e.hdfc)
        }
        else {
          y.push(e.sale);
        }
      }

      )
      setYN([...y]);
    }
  }
  useEffect(() => {
    fetchSale();
  }, [days])
  useEffect(() => {
    makeGraphAxes(param);
  }, [param, days, store])
  // console.log(row)
  return (
    <>
      {tableLoad? <Skelton/> : <div className="container table-cont ps-md-1" style={{
        paddingLeft:"0"
      }}>
        <div className="col-12">
          <div className="row">
            <div className=" order-md-1 order-2 col-md-7 col-12">
              {store === 'AKT Old' && <> <Graph xdata={xDataO} ydata={yDataO} param={param} /> </>}
              {store === 'AKT New' && <> <Graph xdata={xDataN} ydata={yDataN} param={param} />   </>}
            </div>
            <div className=" order-md-2 order-1 col-md-5 col-12 mt-md-3">
              {/* <FormControl> */}
                <Select
                align="left"
                  fullWidth
                  className='table-select'
                  // style={{
                  //   padding:"5px",
                  //   margin:'15px'
                  // }}
                  // margin="dense"
                  labelId="role"
                  id="role-select"
                  // label="Store"
                  value={store}
                  // label="Store"
                  onChange={(e) => { setStore(e.target.value) }}
                >
                  <MenuItem value="AKT Old">AKT Old</MenuItem>
                  <MenuItem value="AKT New">AKT New</MenuItem>
                </Select>
              {/* </FormControl> */}
              {/* <FormControl> */}
                <Select
                className='table-select'
                align="left"
                  fullWidth
                  margin="dense"
                  labelId="role"
                  id="role-select"
                  value={days}
                  // label="Days"
                  onChange={(e) => { setDays(e.target.value) }}
                >
                  <MenuItem value="30"> Last 30 Days</MenuItem>
                  <MenuItem value="60">Last 2 Month</MenuItem>
                  <MenuItem value="180">Last 6 Month</MenuItem>
                  {/* <MenuItem value="Hdfc">HDFC</MenuItem> */}
                </Select>
              {/* </FormControl>
              <FormControl> */}
                <Select
                className='table-select'
                align="left"
                  fullWidth
                  margin="dense"
                  labelId="role"
                  id="role-select"
                  value={param}
                  // label="Param"
                  onChange={(e) => { setParam(e.target.value) }}
                >
                  <MenuItem value="sale">Sale</MenuItem>
                  <MenuItem value="paytm">Paytm</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="Hdfc">HDFC</MenuItem>
                </Select>
              {/* </FormControl> */}
            </div>
          </div>

        </div>
        {store === 'AKT Old' && <> 
          <Box>
            <DataGrid
              autoHeight
              getRowId={(row) => row._id}
              rows={saleO}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              loading={tableLoad}
              experimentalFeatures={{ newEditingApi: true }}
              components={{ Toolbar: GridToolbarExport }}
            />
          </Box>
        </>
        }
        {store === 'AKT New' && <>
          <Box >
            <DataGrid
              autoHeight
              getRowId={(row) => row._id}
              rows={saleN}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              loading={tableLoad}
              experimentalFeatures={{ newEditingApi: true }}
              components={{ Toolbar: GridToolbarExport }}
            />
          </Box>
        </>}
      </div>}
      </>
      );
}


