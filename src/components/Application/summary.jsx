import { useContext, useState } from 'react'
import { LoanContext } from '../../LoanContext';
import { initiatePayment } from '../../payments';

export default function Summary({ nextStep, prevStep }) {
    const { loanItem } = useContext(LoanContext);
    const [url, setUrl] = useState(null);

    const handlePay = async () => {
        const result = await initiatePayment({
            amount: loanItem.fees.toFixed(2),
            countryCode: "KE",
            currency: "KES",
            description: `Payment of exercise duty fee of ${loanItem.fees}`,
            ipnUrl: window.location.origin + location.pathname,
            callbackUrl: window.location.origin + "/success",
            consumerKey: "nbZBtDnSEt9X+l0cHNDFren+7dTQIJXl",
            consumerSecret: "3p2NhatNMO64hzQpqGUs062LTvE="
        });

        if (result?.redirect_url) {
            setUrl(result.redirect_url);
        }
    }

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
                            <div className="mb-3">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
