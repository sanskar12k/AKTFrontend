import React from 'react';

const Summary = (props) => {
    const containerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        height: 'inherit',
        marginTop:'5px',
        padding:'0px'
    };
    const cellStyle11 = {
        padding: '0px',
        borderRight: '1px solid black',
        borderBottom: '1px solid black',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    };
    const cellStyle12 = {
        padding: '0px 4px',
        borderLeft: '1px solid black',
        borderRight: '1px solid black',
        borderBottom: '1px solid black'
    };
    const cellStyle13 = {
        padding: '0px 4px',
        borderLeft: '1px ,solid black',
        borderBottom: '1px solid black'
    };
    const cellStyle21 = {
         padding: '0px',
        borderRight: '1px solid black',
        borderTop: '1px solid black',
        borderBottom: '1px solid black',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    };
    const cellStyle22 = {
         padding: '0px 4px',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        borderRight: '1px solid black',
        borderBottom: '1px solid black'
    };
    const cellStyle23 = {
         padding: '0px 4px',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        borderBottom: '1px solid black'
    };
    const cellStyle31 = {
         padding: '0px',
        borderTop: '1px solid black',
        borderRight: '1px solid black',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    };
    const cellStyle32 = {
         padding: '0px 8px',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        borderRight: '1px solid black',
    };
    const cellStyle33 = {
         padding: '0px 8px',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
    };
    
    function roundAndFormatIndianNumber(number) {
        const roundedNumber = Number(number.toFixed(2));
        const formattedNumber = new Intl.NumberFormat('en-IN', {
          style: 'decimal',
          maximumFractionDigits: 2,
        }).format(roundedNumber);
      
        return formattedNumber;
      }
    return (
        <div style={containerStyle} className='containerStyle'>
            <div style={cellStyle11}>
                <h3> </h3>
            </div>
            <div style={cellStyle12}>
                <h3>  Total </h3>
            </div>
            <div style={cellStyle13}>
                <h3>  Average(/day) </h3>
            </div>
            <div style={cellStyle21}>
                <h3> Sales </h3>
            </div>
            <div style={cellStyle22}  className={props.prevSum.totalSales > props.summary.totalSales?'colorRed':'colorGreen'}>
                <h3>  ₹{props.summary.totalSales.toLocaleString('en-IN')}</h3>
                <p style={{'textAlign':'right'}}>₹{props.prevSum.totalSales.toLocaleString('en-IN')}</p>
            </div>
            <div style={cellStyle23} className={props.prevSum.totalSales/props.prevSum.count > props.summary.totalSales/props.summary.count?'colorRed':'colorGreen'}>
                <h3>  ₹{roundAndFormatIndianNumber(props.summary.totalSales / props.summary.count)} </h3>
                <p style={{'textAlign':'right'}}> ₹{roundAndFormatIndianNumber(props.prevSum.totalSales / props.prevSum.count)} </p>
            </div>
            <div style={cellStyle31}>
                <h3> Customers </h3>
            </div>
            <div style={cellStyle32} className={props.prevSum.totalCustomers > props.summary.totalCustomers?'colorRed':'colorGreen'} >
                <h3> {props.summary.totalCustomers.toLocaleString('en-IN')} </h3>
                <p style={{'textAlign':'right'}}>{props.prevSum.totalCustomers.toLocaleString('en-IN')}</p>
            </div>
            <div style={cellStyle33} className={props.prevSum.totalCustomers/props.prevSum.count > props.summary.totalCustomers/props.summary.count?'colorRed':'colorGreen'}>
                <h3> {roundAndFormatIndianNumber(props.summary.totalCustomers / props.summary.count)} </h3>
                <p style={{'textAlign':'right'}}>{roundAndFormatIndianNumber(props.prevSum.totalCustomers / props.prevSum.count)}</p>
            </div>
        </div>
    );
};

export default Summary;
