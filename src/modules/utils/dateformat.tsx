import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/en';

dayjs.extend(utc);
const yesterday = dayjs().subtract(1, 'day');

export const formatDisplayDateTime = (date: any) => {
    return dayjs(date).format('YYYY-MMM-DD, hh:mm A');
}
export const formatDisplayTime = (date: any) => {
    return dayjs(date).format('hh:mm aa');
}
export const formatDisplayTimeOnly = (date: any) => {
    return dayjs(date).format('hh:mm A');
}
export const formatDisplayDate = (date: any) => {
    return dayjs(date).format('YYYY-MM-DD');
}
export const dateStringToObject = (date: any) => {
    return dayjs(date).format('MM/DD/YYYY');
}
export const dateStringToObjectDayfirst = (date: any) => {
    return dayjs(date).format('DD/MM/YYYY');
}
export const formatDisplayMonth = (date: any) => {
    return dayjs(date).format('MMMM DD,YYYY hh:mm A');
}
export const dateStringToObjectByMonth = (date: any) => {
    return dayjs(date).format('DD-MMM-YYYY');
}
export const dateStringToObjectByMonthNumber = (date: any) => {
    return dayjs(date).format('DD-MM-YYYY');
}
export const formatDisplayDateMonth = (date: any) => {
    return dayjs(date).format('YYYY-MMM-DD');
}
export const currentDateTime = () => { return dayjs() }
export const currentMonth = () => { return dayjs().utc().format('MMMM') }
export const startOfThisMonth = () => dayjs().startOf('month').utc().format();
export const endOfThisMonth = () => dayjs().endOf('month').utc().format();
export const startOfDay = (datetime: any) => dayjs(datetime).startOf('day').utc().format();
export const endOfDay = (datetime: any) => dayjs(datetime).endOf('day').utc().format();
export const formatToUTC = (datetime: any) => dayjs(datetime).utc().format();
export const formattedYesterday = yesterday.format('MMMM DD');
