import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridToolbarExport } from '@mui/x-data-grid';
import { useState, useEffect } from "react"
import api from './api'
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import Graph from './graph';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Skelton from '../skeleton/dashboard';
import './table.css'
import { Button, Fab, InputLabel, Modal, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Api from './api';
import Summary from './summary';
const columns: GridColDef[] = [
  {
    field: 'created',
    headerName: 'Date',
    width: 200
  },
  // {
  //   field: 'store',
  //   headerName: 'Store',
  //   sortable: false,
  //   width: 180,
  // },
  {
    field: 'sale',
    headerName: 'Sale',
    width: 200,
  },
  {
    field: 'customer',
    headerName: 'Customer',
    width: 170,
  },
  {
    field: 'paytm',
    headerName: 'Paytm',
    // type: 'number',
    width: 180,
  },
  {
    field: 'hdfc',
    headerName: 'HDFC',
    width: 170,
  },
  {
    field: 'addedName',
    headerName: 'Added by',
    width: 200
  }
];

function CustomToolbar() {
  return (
    <GridToolbarExport />
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 440,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
};
export default function DataGridDemo(props) {
  const [saleO, setSale] = useState([]);
  const [xDataO, setX] = useState([]);
  const [yDataO, setY] = useState([]);
  const [saleN, setSaleN] = useState([]);
  const [xDataN, setXN] = useState([]);
  const [yDataN, setYN] = useState([]);
  const [param, setParam] = useState('sale');
  const [days, setDays] = useState(1);
  const [tableLoad, setLoad] = useState(false);
  const [store, setStore] = useState('AKT New');
  const [storeUp, setStoreUp] = useState('AKT Old');//
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [report, setReport] = useState();
  const [sale, setSales] = useState(0);
  const [customer, setCustomer] = useState(0);
  const [paytm, setPaytm] = useState(0);
  const [hdfc, setHdfc] = useState(0);
  const [value, setValue] = useState(
    dayjs(Date.now())
  );
  const [id, setId] = useState();
  const [summary, setSummary] = useState([]);
  const [prevSum, setprevSum] = useState([
    { 'count': 1, 'totalCustomers': 0, 'totalOnlinePayment': 0, 'totalSales': 0, '_id': "AKT New" }
  ]);
  const [plot, setPlot] = useState("Sale");
  const plots = [
    { val: "Sale", id: "sale" },
    { val: "Customers", id: "customer" }
  ]
  const handleChangeStore = (e) => {
    setStoreUp(e.target.value);
  };
  const handleChangeStoreParam = (e) => {
    setStoreUp(e.target.value);
  };
  const handleEvent = (
    params,  // GridCellParams
    event,   // MuiEvent<React.MouseEvent<HTMLElement>>
    details, // GridCallbackDetails
  ) => {
  }
  const fetchSale = async () => {
    try {
      setLoad(true)
      const res = await api.get(`/sale/sales/${store}/${days}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': document.cookie
          },
        }, { withCredentials: true });
      if (res.status === 200) {
        const data = res.data;
        let y = [];
        let x = [];
        setSale(
          data.reportOld.map(e => {
            if (e.created) { e.created = new Date(e.created).toLocaleDateString('en-GB'); }
            if (e.added) e.username = `${e.added.fname} ${e.added.lname}`
            x.push(e.created);
            y.push(e.sale);
            return { ...e }
          })
        )
        let xn = [];
        let yn = [];
        setX([...x]);
        setY([...y]);
        // if (store == "AKT Old") setSummary(data.summary[1]);
        // else setSummary(data.summary[0]);
        console.log(data.summary);
        setSummary(data.summary);
        if (data.prevSummary.length > 0)
          setprevSum(data.prevSummary)
        else {
          setprevSum([{ 'count': 1, 'totalCustomers': 0, 'totalOnlinePayment': 0, 'totalSales': 0, '_id': "AKT New" }])
        }
      }
      setLoad(false)
    }
    catch (e) { console.log(e) }
  }

  const updateSale = async (id) => {
    try {
      setLoad(true);
      const res = await Api.patch(`/sale/${id}/edit`, {
        sale: sale,
        customer: customer,
        store: storeUp,
        paytm: paytm,
        hdfc: hdfc,
      },
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': document.cookie
          }
        },
      )
      handleClose();
      setLoad(false);
    } catch (error) {

    }
  }

  const makeGraphAxes = (param) => {
    let y = [];
    saleO.map(e => {
      if (param === 'customer') {
        y.push(e.customer)
      }
      else {
        y.push(e.sale);
      }
    }
    )
    setY([...y]);
  }
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    height: 'inherit'
  };
  // const makeGraphAxes = (param) => {
  //   let y = [];
  //   if (store === 'AKT Old') {
  //     saleO.map(e => {
  //       if (param === 'paytm') {
  //         y.push(e.paytm);
  //       }
  //       else if (param === 'customer') {
  //         y.push(e.customer)
  //       }
  //       else if (param === 'hdfc') {
  //         y.push(e.hdfc)
  //       }
  //       else {
  //         y.push(e.sale);
  //       }
  //     }

  //     )
  //     setY([...y]);
  //   }
  //   else {
  //     saleN.map(e => {
  //       if (param === 'paytm') {
  //         y.push(e.paytm);
  //       }
  //       else if (param === 'customer') {
  //         y.push(e.customer)
  //       }
  //       else if (param === 'hdfc') {
  //         y.push(e.hdfc)
  //       }
  //       else {
  //         y.push(e.sale);
  //       }
  //     }

  //     )
  //     setYN([...y]);
  //   }
  // }
  useEffect(() => {
    fetchSale();
  }, [days, store])
  useEffect(() => {
    makeGraphAxes(param);
  }, [param, days, store])
  // console.log(row)
  return (
    <>
      {tableLoad ? <Skelton /> : <div className="container table-cont ps-md-1" style={{
        paddingLeft: "0"
      }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" align='center' component="p">
              Report
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-helper-label">Store</InputLabel>
              <Select
                align="left"
                margin="normal"
                labelId="store-update"
                id="store-update-select"
                value={storeUp}
                required
                label="Store"
                onChange={handleChangeStore}
              >
                <MenuItem value="AKT Old">AKT Old</MenuItem>
                <MenuItem value="AKT New">AKT New</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              id="outlined-required"
              label="Sale"
              fullWidth
              margin="normal"
              value={sale}
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              onChange={e => {
                console.log(e.target.value);
                setSales(e.target.value);
                console.log(e.target.value);
              }
              }
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="Customers"
              value={customer}
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              onChange={e => setCustomer(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="Paytm"
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              value={paytm}
              onChange={e => setPaytm(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="HDFC"
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              value={hdfc}
              onChange={e => setHdfc(e.target.value)}
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }} align='center' >
              <Button align='center' variant='contained' color='success' onClick={(e) => { e.preventDefault(); updateSale(id); console.log("updated") }}>Save</Button>
            </Typography>
          </Box>
        </Modal>
        <div className="col-12">
          <div className="row">
            <div className=" order-md-1 order-2 col-md-6 col-12">
              {plots && plots.map((p) =>
                <>
                  <Fab key={p.id} variant="extended" size="small" className={param == p.id ? 'mx-md-5 mx-0 mt-3 param-button' : 'mx-5 mt-3'} onClick={() => { setParam(p.id) }}>
                    {p.val}
                  </Fab>
                </>
              )}
              {<> <Graph xdata={xDataO} ydata={yDataO} param={param} /> </>}
            </div>
            <div className=" order-md-2 order-1 col-md-6 col-12 mt-md-3 mt-2">
              <div className="container-fluid" >
                <div className="row">
                  <div className=" order-md-2 order-1 col-md-6 col-12 mt-md-3">
                    <Select
                      align="left"
                      fullWidth
                      className='table-select'
                      labelId="store"
                      id="store-select"
                      value={store}
                      onChange={(e) => { setStore(e.target.value) }}
                    >
                      <MenuItem value="AKT Old">AKT Old</MenuItem>
                      <MenuItem value="AKT New">AKT New</MenuItem>
                    </Select>
                  </div>
                  <div className=" order-md-2 order-1 col-md-6 col-12 mt-md-3">
                    <Select
                      className='table-select'
                      align="left"
                      fullWidth
                      margin="dense"
                      labelId="role"
                      id="role-select"
                      value={days}
                      onChange={(e) => { setDays(e.target.value) }}
                    >
                      <MenuItem value="1"> This Month</MenuItem>
                      <MenuItem value="6">Last 6 Month</MenuItem>
                      <MenuItem value="12">Last 1 Year</MenuItem>
                    </Select>
                    {/* <Summary/> */}
                  </div>
                </div>
                <div className="row" >
                  <div className="col-12">
                    {summary.length > 0 && <Summary summary={summary[0]} prevSum={prevSum[0]} />}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
        <>
          <Box>
            <DataGrid
              autoHeight
              onCellDoubleClick={handleEvent}
              getRowId={(row) => row._id}
              rows={saleO}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              loading={tableLoad}
              onRowClick={(params, event) => {
                if (!event.ignore) {
                  console.log(params);
                  setId(params.row._id);
                  setSales(params.row.sale);
                  setCustomer(params.row.customer)
                  setPaytm(params.row.paytm);
                  setHdfc(params.row.hdfc);
                  setStoreUp(params.row.store);
                  handleOpen();
                }
              }}
              experimentalFeatures={{ newEditingApi: true }}
            // components={{ Toolbar: GridToolbarExport }}
            />
          </Box>
        </>
        {/* } */}
        {/* {store === 'AKT New' && <>
          <Box >
            <DataGrid
              autoHeight
              getRowId={(row) => row._id}
              rows={saleN}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              loading={tableLoad}
              onRowClick={(params, event) => {
                if (!event.ignore) {
                  console.log(params.id);
                  handleOpen();
                }
              }}
              experimentalFeatures={{ newEditingApi: true }}
            // components={{ Toolbar: GridToolbarExport }}
            />
          </Box>
        </>} */}
      </div>}
    </>
  );
}


