import express from "express"
import { isAuthorized } from "../middleware/Auth.js"
import {  employerGetAllApplications, jobseekerDeleteApplication, jobseekerGetAllApplications, postApplication } from "../controllers/applicationController.js"

const router=express.Router()

router.get('/jobseeker/getall',isAuthorized,jobseekerGetAllApplications)
router.get('/employer/getall',isAuthorized,employerGetAllApplications)
router.delete('/delete/:id',isAuthorized,jobseekerDeleteApplication)
router.post('/post',isAuthorized,postApplication)

export default router;