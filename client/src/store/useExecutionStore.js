import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";



export const useExecutionStore = create((set)=>({
    isExecuting: false,
    isSubmitting: false,
    submission: null,

       executeCode:async ( source_code, language_id, stdin, expected_outputs, problemId, saveSubmission = false)=>{
        try {
            set({
                isExecuting: saveSubmission ? false : true,
                isSubmitting: saveSubmission,
            });
            console.log("Submission:",JSON.stringify({
                source_code,
                language_id,
                stdin,
                expected_outputs,
                problemId
            }));
            const res = await axiosInstance.post("/execution" , { source_code, language_id, stdin, expected_outputs, problemId, saveSubmission  });

            console.log("res", res);
            

            set({submission:res.data.submission});
      
            toast.success(res.data.submission.status);
        } catch (error) {
            console.log("Error executing code",error);
            toast.error(error?.response?.data?.message);
            set({submission:null});
        }
        finally{
            set({isExecuting:false});
            if(saveSubmission){
                set({isSubmitting:false});
            }
        }
    }
}))