'use client'
import { useState, useEffect } from "react";
import React, { useContext } from "react";
import { RequestContext } from "@/context/Request";
import { AccountContext } from "@/context/Account";
import RequestCardForAdmin from "./RequestCardForAdmin";
import CommentDialog from "./CommentDialog";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import StatusForAdmin from "@/components/StatusForAdmin";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { FormControl, TableHead, TableRow } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

type indRequestForAdmin = {
    id: number
    groupname: number
    machine: number
    loadBearing: boolean
    filename: string
    material: string[]
    status: string
    comment: string
    timeleft: Date
}

export default function ThreeDPQueueListForAdmin() {
    const { requests } = useContext(RequestContext);
    const { user } = useContext(AccountContext);
    const [ requestList, setRequestList ] = useState<indRequestForAdmin[]>();
    const { getThreeDPRequest, putThreeDPRequestMachine, putThreeDPRequestStatus } = useThreeDPRequest(); 
    const testRequest = {
        filename: "test1",
        type: "3DP",
        comment: "test1",
        status: "waiting",
    };
    const Button = require('@mui/material/Button').default
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [dialogString, setDialogString] = useState("");
    
    useEffect(() => {
        const gReq = async () => {
            try{
                const requestListInit = await getThreeDPRequest();
                const requestListJson:indRequestForAdmin[] = requestListInit["dbresultReq"];
                setRequestList(requestListJson);
            }
            catch(e){
                console.log(e);
            }
        }
        gReq();
    }, []);
    
    const handleMachineChange = async (id: number, newMachine: number) => {
        try{
            await putThreeDPRequestMachine({
                id,
                newMachine
            })
        }catch(e){
            console.error(e);
        }
    }
    
    return (
        <>
        <div className="h-10 m-2 flex items-center justify-center cursor-pointer">
            <h1 className="text-3xl font-bold text-yellow-400">3DP使用申請</h1>
        </div>
        <div className="h-3"></div>
        <div className="flex w-full justify-center">
            <TableContainer component={Paper} sx={{width: '80%', maxHeight: '400px', overflow: 'auto'}}>
                <Table aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        <TableRow key="head" className="bg-yellow-300">
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>預約組別</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>檔案名稱</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>使用機台</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>承重與否</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>使用材料</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>列印狀態</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>備註</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div className="flex w-full justify-center">
            <TableContainer component={Paper} sx={{width: '80%', maxHeight: '400px', overflow: 'auto'}}>
                <Table aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        {
                            requestList?.map((request)=>(
                            <TableRow key={request.id}>
                                <TableCell sx={{textAlign: 'center'}}>{String(request.groupname)}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.filename}</TableCell>
                                
                                <TableCell>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">機台編號</InputLabel>
                                            <Select
                                                // labelId="demo-simple-select-label"
                                                // id="demo-simple-select"
                                                defaultValue={String(request.machine)}
                                                label="機台編號"
                                                onChange={(e)=>{handleMachineChange(request.id, Number(e.target.value));}}>
                                                <MenuItem value={0}>未安排</MenuItem>
                                                <MenuItem value={1}>{Number(1)}</MenuItem>
                                                <MenuItem value={2}>{Number(2)}</MenuItem>
                                                <MenuItem value={3}>{Number(3)}</MenuItem>
                                                <MenuItem value={4}>{Number(4)}</MenuItem>
                                            </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell sx={{textAlign: 'center'}}>{request.loadBearing? "是" : "否"}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.material}</TableCell>

                                <TableCell sx={{textAlign: 'center'}}>
                                    <StatusForAdmin id={request.id} initialState={request.status} timeStarted={request.timeleft} type="3dp"></StatusForAdmin>
                                </TableCell>

                                <TableCell sx={{textAlign: 'center'}}>
                                    <Button onClick={()=>{setCommentDialogOpen(true); setDialogString(request.comment)}}>{request.comment}</Button>    
                                </TableCell>
                            </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <CommentDialog open={commentDialogOpen} comment={dialogString} onClose={() => setCommentDialogOpen(false)}/>
        </>
    )
}