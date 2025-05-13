import { useContext } from 'react';
import "./Application.css";
import { useNavigate } from 'react-router-dom';
import { LoanContext } from '../../LoanContext';

export default function Success() {
    const { loanItem } = useContext(LoanContext);
    const navigate = useNavigate();
    return (
        <div className="container-fluid my-3">
            <section className="speedyui speedyui-sign-in">
                <AppHelmet title={"Loan Application"} />
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-7 col-xl-5">
                            <div className="form-wrapper py-md-4">
                                <div className="alert-box">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
