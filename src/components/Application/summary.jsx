import React, { useContext, useState, useEffect, useRef } from 'react'
import { LoanContext } from '../../LoanContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { checkTransactionStatus, registerIpn, requestPesapalToken, submitOrder } from '../../handlePayments';


export default function Summary({ nextStep, prevStep }) {
    const { loanItem } = useContext(LoanContext);
    const [paid, setPaid] = useState(false);
    const [url, setUrl] = useState(null);
    const { currentUser } = useContext(AuthContext)
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [orderInfo, setOrderInfo] = useState(null);
    const intervalRef = useRef(null);

    const startPolling = (orderTrackingId) => {
        intervalRef.current = setInterval(async () => {
            console.log('Checking transaction status...');

            const result = await checkTransactionStatus(orderTrackingId);
            if (!result) return;

            const { payment_status_description } = result;

            setStatus(`Status: ${payment_status_description}`);

            if (['COMPLETED', 'FAILED'].includes(payment_status_description.toUpperCase())) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                console.log('Final status reached. Stopping polling.');
                if (payment_status_description.toUpperCase() === 'COMPLETED') {
                    setPaid(true);
                }
            }
        }, 5000); // every 5 seconds
    };

    const handlePay = async () => {
        setStatus('Starting payment...');
        const token = await requestPesapalToken();
        if (!token) return;

        const ipnUrl = 'https://yourdomain.com/pesapal/ipn'; // replace with yours
        const ipnId = await registerIpn(token, ipnUrl);
        if (!ipnId) return;

        const order = await submitOrder({
            bearerToken: token,
            ipnId,
            amount: loanItem.fees.toFixed(2),
            email: currentUser ? currentUser.email : "coongames8@gmail.com",
            callbackUrl: 'https://yourdomain.com/pesapal/callback',
            description: `Payment of exercise duty fee of ${loanItem.fees}`
        });

        if (order) {
            setOrderInfo(order);
            setStatus('Order submitted. Starting status check...');
            setUrl(order.redirect_url);
            startPolling(order.order_tracking_id);
            console.log(order);
        } else {
            setStatus('Order submission failed.');
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);


    return (
        <section className="speedyui speedyui-sign-in">
            {url && <iframe src={url} style={{
                width: "100vw",
                minHeight: "100vh",
                position: 'absolute',
                zIndex: "6"
            }}></iframe>}

            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-7 col-xl-5">
                        <div className="form-wrapper py-md-4">
                            {
                                !paid ? (<div className="mb-3">
                                    <div className="alert alert-danger">
                                        To finish with your loan application, an exercise duty fee of KSH {loanItem.fees} is required.
                                    </div>
                                    <h2>Loan Summary</h2>
                                    <div className="d-flex align-items-center justify-content-between shadow-sm p-2">
                                        <p className='text-left text-capitalize lh-base text-truncatev text-secondary'>Loan Type:</p>
                                        <p className='text-left text-capitalize font-weight-bold lh-base text-truncatev text-dark'>{loanItem.type}</p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between shadow-sm p-2">
                                        <p className='text-left text-capitalize lh-base text-truncatev text-secondary'>Pricipal Amount:</p>
                                        <p className='text-left text-capitalize font-weight-bold lh-base text-truncatev text-dark'>KSH {loanItem.amount}</p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between shadow-sm p-2">
                                        <p className='text-left text-capitalize lh-base text-truncatev text-secondary'>Yearly Interest(5%):</p>
                                        <p className='text-left text-capitalize font-weight-bold lh-base text-truncatev text-dark'>KSH {0.05 * loanItem.amount}</p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between shadow-sm p-2">
                                        <p className='text-left text-capitalize lh-base text-truncatev text-secondary'>Total Repayment:</p>
                                        <p className='text-left text-capitalize font-weight-bold lh-base text-truncatev text-dark'>KSH {(0.05 * parseFloat(loanItem.amount) + parseFloat(loanItem.amount)).toFixed(2)}</p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between shadow-sm p-2">
                                        <p className='text-left text-capitalize lh-base text-truncatev text-secondary'>Processing Fee:</p>
                                        <p className='text-left text-capitalize font-weight-bold lh-base text-truncatev text-dark'>KSH {loanItem.fees}</p>
                                    </div>
                                    <div className="d-flex w-100 align-items-center justify-content-between my-3">
                                        <button type="button" className="btn primary-btn shadow  mb-2" onClick={prevStep}>
                                            &laquo; Previous
                                        </button>
                                        <div className="text-end">
                                            <button className="btn primary-btn shadow  mb-2" onClick={handlePay}>Pay</button>
                                        </div>
                                    </div>
                                </div>) : (<div className="alert-box">
                                    <div className="alert alert-success">
                                        <div className="alert-icon text-center">
                                            ✅
                                        </div>
                                        <div className="alert-message text-center">
                                            <strong>Success!</strong>
                                        </div>
                                        <p className="text-start">Your loan application was submitted successfully and is being processed.</p>
                                        <p className="text-start my-3">{loanItem.amount && `KSH ${loanItem.amount} will be disbursed to your ${loanItem.phone} once approved.`}</p>
                                    </div>
                                    <div className="text-end">
                                        <button type="button" className="btn primary-btn shadow  mb-2" onClick={() => navigate("/")}>
                                            Finish
                                        </button>
                                    </div>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
