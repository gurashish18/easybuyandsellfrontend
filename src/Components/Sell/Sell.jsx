import React,{useState,useContext} from 'react';
import './Sell.css';
import useStyles from './styles';
import {Typography, Paper, TextField, Grid, Button, InputLabel, Select, MenuItem, Modal} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import DevicesIcon from '@material-ui/icons/Devices';
import WeekendIcon from '@material-ui/icons/Weekend';
import FaceIcon from '@material-ui/icons/Face';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import SportsCricketIcon from '@material-ui/icons/SportsCricket';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import {AuthContext} from '../Firebase/currentUser';
import {auth, storage} from '../Firebase/firebase';
import {Link, useHistory} from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";




const Sell = () => {
    
    const classes = useStyles();
    const history = useHistory();
    const {currentUser} = useContext(AuthContext)
    const [open, setOpen] = useState(false);
    const[loading, setloading] = useState(false)

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    let isloggedin;
    if(currentUser){
        isloggedin = true;
    }else{
        isloggedin = false;
    }
    // Field States
    const[name, setname] = useState("");
    const[category, setcategory] = useState("");
    const[quantity, setquantity] = useState("");
    const[description, setdescription] = useState("");
    const[price, setprice] = useState("");
    const [files, setfiles] = useState([])
    //Error States
    let[nameE, setnameE] = useState("");
    let[quantE, setquantE] = useState("");
    let[descE, setdescE] = useState("");
    let[priceE, setpriceE] = useState("");
    let[fileE, setfileE] = useState("");

    let valid = () =>{
        let nameE = ""; let quantE = ""; let descE = ""; let priceE = ""; let fileE  = "";
        
        if(name.length < 3){
            nameE = "Invalid name";
        }
        if(quantity <= 0){
            quantE = "Invalid quantity";
        }
        if(description.length < 10){
            descE = "Minimum 10 characters required";
        }
        if(price < 0){
            priceE = "Price cannot be < 0";
        }
        if(files.length < 1 || files.length >5){
            fileE = "Minimum 1 and Maximum 5 images can be uploaded";
        }

        if(nameE || quantE || descE || priceE || fileE){
            setnameE(nameE);
            setquantE(quantE);
            setdescE(descE);
            setpriceE(priceE);
            setfileE(fileE);
            return false;
        }
        return true;
    }

    const sell=()=>{
        const data=new FormData()
        data.append("name",name)
        data.append("category",category)
        data.append("quantity",quantity)
        data.append("description",description)
        data.append("college","Thapar University")
        for (let i = 0; i < files.length; i++) {
            data.append("productImage",files[i], files[i].name)
        }
        data.append("id",currentUser.uid)
        data.append("price",price)

        axios.post("http://localhost:8080/sell"
                   ,data
                   ,{headers: { "Content-Type": "multipart/form-data" }}
                   ).then((res)=>{
                       
                    alert(res.data)
                   }).catch((e)=>{alert(e)})

    }

    const imageupload=()=>{
          const promises = [];
          for (let i = 0; i < files.length; i++) {
          const uploadTask = storage.ref(`images/${files[i].name}`).put(files[i]);
          promises.push(uploadTask);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
            //   const progress = Math.round(
            //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            //   );
            //   setProgress(progress);
            },
            (error) => {
              console.log(error);
            },
            async () => {
              await storage
                .ref("images")
                .child(files[i].name)
                .getDownloadURL()
                .then((urls) => {
                //   setUrls((prevState) => [...prevState, urls]);
                });
            }
          );
        };
    
        Promise.all(promises)
          .then(() => alert("All images uploaded"))
          .catch((err) => console.log(err));
    }



    const handleSaveProduct = (event) => {
        let isValid = valid();
        event.preventDefault();
        if(isValid){
            setloading(true)
            setnameE("");
            setquantE("");
            setdescE("");
            setpriceE("");
            setfileE("");
            sell()
            imageupload()
            setloading(false)
        }
    }
    
    return (
        <div className="sell">
            <div className="sell_container">
                <h1 className="sell_title">Sell your products by adding details...</h1>
                <form className="form">
                    <div className="form_container">
                        <div className="form_element">
                            <h4>Product Name</h4>
                            <input type="text" value={name} onChange={(event)=>setname(event.target.value)} />
                            <p className="error">{nameE}</p>
                        </div>
                    </div>
                    <div className="form_container">
                        <div className="form_element">
                            <h4>Product Category</h4>
                            <Select
                                fullWidth
                                required
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={category}
                                onChange={(event => { setcategory(event.target.value) })}
                            >

                                <MenuItem value={"Mobiles"} className="items">
                                    <div className="items">
                                        <PhoneAndroidIcon />
                                        <p style={{paddingLeft: '10px'}}>Mobiles</p>
                                     </div>
                                </MenuItem>
                                <MenuItem value={"Books"} className="items">
                                    <div className="items">
                                        <ImportContactsIcon />
                                        <p style={{paddingLeft: '10px'}}>Books</p>
                                     </div>
                                </MenuItem>
                                <MenuItem value={"Bikes"} className="items">
                                    <div className="items">
                                        <MotorcycleIcon />
                                        <p style={{paddingLeft: '10px'}}>Bikes</p>
                                    </div>
                                </MenuItem>
                                <MenuItem value={"Electronics"} className="items">
                                    <div className="items">
                                        <DevicesIcon />
                                        <p style={{paddingLeft: '10px'}}>Electronics</p>
                                    </div>
                                </MenuItem>
                                <MenuItem value={"Furniture"} className="items">
                                    <div className="items">
                                        <WeekendIcon />
                                        <p style={{paddingLeft: '10px'}}>Furnitures</p>
                                    </div>
                                </MenuItem>
                                <MenuItem value={"Fashion"} className="items">
                                    <div className="items">
                                        <FaceIcon />
                                        <p style={{paddingLeft: '10px'}}>Fashion</p>
                                    </div>
                                </MenuItem>
                                <MenuItem value={"Others"} className="items">
                                    <div className="items">
                                        <AddIcon />
                                        <p style={{paddingLeft: '10px'}}>Others</p>
                                    </div>
                                </MenuItem>

                            </Select>
                        </div>
                    </div>

                    <div className="form_container">
                        <div className="form_element">
                            <h4>Product Quantity</h4>
                            <input type="number" value={quantity} onChange={(event)=>setquantity(event.target.value)}/>
                            <p className="error">{quantE}</p>
                        </div>
                    </div>

                    <div className="form_container">
                        <div className="form_element">
                            <h4>Product Description</h4>
                            <textarea id="description" name="description" rows="8" cols="25" value={description} onChange={(event)=>setdescription(event.target.value)} />
                            <p className="error">{descE}</p>
                        </div>
                    </div>

                    <div className="form_container">
                        <div className="form_element">
                            <h4>Product Price(₹)</h4>
                            <input type="number" value={price} onChange={(event)=>setprice(event.target.value)} />
                            <p className="error">{priceE}</p>
                        </div>
                    </div>

                    <div className="form_container">
                        <div className="form_element">
                            <h4>Product Images</h4>
                            <input type="file" accept=".jpg, .jpeg, .png" multiple onChange={(event)=>{setfiles(event.target.files)}}/>
                            <p className="error">{fileE}</p>
                        </div>
                    </div>
                </form>

                <div className="btn_container">
                    <Button variant="contained" className="btn" startIcon={<SaveIcon />} onClick={handleSaveProduct}>Save Product</Button>
                </div>
            </div>

            <ClipLoader size={150} loading={loading}/>
        </div>
    )
}

export default Sell
