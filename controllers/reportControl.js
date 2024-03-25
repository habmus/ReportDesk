import { getDailyReport, getMonthlyReport, getYearlyReport, getLocationReport, getDurationReport, getCoursesReport } from '../models/database.js';



export const daily_report = (async (req,res)=> {
    const reportDaily = await getDailyReport("2024-03-24")
    res.render("Report-Preview-Daily.ejs",{reportDaily})
  })

export const monthly_report = (async (req,res)=> {
  const  cleanDate = "2024-03-24"
  //let cleanDate = rawdate.slice(0,7)
  let cleanYear = cleanDate.substring(0,4)
  let cleanMonth = cleanDate.substring(5,7)
  const date = new Date(cleanYear,cleanMonth)
  const dateArray = []
  for(let i = 0; i < 6; i++)
    {   
      date.setMonth(date.getMonth()-1)
      let dateISO =(date.toISOString())
      let saveDate = dateISO.slice(0,7)
      dateArray.push(saveDate)
    }
    const reportMonthly = await getMonthlyReport(dateArray)
    console.log(Object.keys(reportMonthly[0]))
    let months = Object.keys(reportMonthly[0])
    console.log(Object.values(reportMonthly[0]))
    let monthValue = Object.values(reportMonthly[0])
    const monthlyNumbers = {months, monthValue}; 
    res.render("Report-Preview-Monthly.ejs",{monthlyNumbers})
  })

export const yearly_report = (async (req,res)=> {
    const targetYear = "2024-03-24"
    let year = targetYear.slice(0,4)
    const reportYearly = await getYearlyReport(year)
    res.render("Report-Preview-Yearly.ejs",{reportYearly})
  })

export const location_report = (async (req,res)=> {
  const targetYear = "2024-03-24"
  let year = targetYear.slice(0,4)
  const reportLocation = await getLocationReport(year)
    res.render("Report-Preview-Location.ejs", {reportLocation})
  })

export const duration_report = (async (req,res)=> {
  const targetYear = "2024-03-24"
  let year = targetYear.slice(0,4)
  const reportDuration = await(getDurationReport(year))
    res.send(reportDuration)
  })

export const courses_report = (async (req,res)=> {
  const targetYear = "2024-03-24"
  let year = targetYear.slice(0,4)
  const reportCourses = await(getCoursesReport(year))
    res.send(reportCourses)
  })
