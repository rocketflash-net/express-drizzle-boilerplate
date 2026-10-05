enum ResponseCodeEnum {
  success = "00",
  bad_request = "40",
  unauthorized = "41",
  validation_error = "42",
  forbidden = "43",
  not_found = "44",
  conflict = "49",
  too_many_requests = "29",
  general_error = "99",
}

export default ResponseCodeEnum;
