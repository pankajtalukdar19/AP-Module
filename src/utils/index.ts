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
