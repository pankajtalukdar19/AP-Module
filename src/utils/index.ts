import moment from "moment";

type convertObjToStringProps = { [k: string]: any } | undefined;

export const convertObjToString = (payload: convertObjToStringProps) => {
  if (payload && Object.keys(payload).length > 0) {
    const newpayload: convertObjToStringProps = {};

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const element = payload[key];
        if (element && element !== "undefined" && element !== "null") {
          newpayload[key] = element;
        }
      }
    }
    let params: string | undefined = new URLSearchParams(newpayload).toString();
    if (params) {
      params = "?" + params;
    } else {
      params = undefined;
    }
    return params;
  }
  return undefined;
};

export const truncateText = (text: any, limit: any) => {
  if (text?.length <= limit) {
    return text;
  }
  return text?.slice(0, limit) + "...";
};

export const twoDecimalPoints = (value: number) => {
  if (value) {
    return value.toFixed(2);
  }
  return "0.00";
};

export const formatDate = (date: string) => {
  return moment(date).format("DD-MM-YYYY HH:mm:ss A");
};

export const formatTimestamp = (isoTimestamp : string)=> {
  // Create a new Date object from the ISO string
  const date = new Date(isoTimestamp);

  // Extract date components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');

  // Extract time components
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Format the date and time
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
