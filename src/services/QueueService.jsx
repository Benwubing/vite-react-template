import axios from "axios";
import config from "../config";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Token ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};
const authInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
});

axios.interceptors.request.use((config) => {
  config.baseURL = import.meta.env.VITE_API_URL;
  return config;
});



const QueueService = {
  register(username, password, firstName, lastName, email) {
    const payload = {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      email: email,
    };
    return axios.post(config.register, payload);
  },
  login(username, password) {
    const payload = { username: username, password: password };
    return axios.post(config.login, payload);
  },
  getQueue(id) {
    return authInstance.get(config.get_queue + id + "/", getHeaders());
  },

  getQueues() {
    return authInstance.get(config.get_queue, getHeaders());
  },
  deleteQueue(id) {
    return authInstance.delete(config.delete_queue + id + "/", getHeaders());
  },
  refreshQueueHash(id) {
    return authInstance.patch(
      config.refresh_queue_hash + id + "/",
      getHeaders()
    );
  },
  addQueue(name, st, et, gq, estTime,prefix,cs) {
    const payload = {
      name: name,
      start_time: st,
      end_time: et,
      group_queue: gq,
      estimated_wait_mins: estTime,
      prefix:prefix,
      color_settings:cs
    };
    return authInstance.post(config.add_queue, payload, getHeaders());
  },
  joinQueue(
    id,
    device,
    queue_hash,
    contact_type = "none",
    contact_value = "none",
    group
  ) {
    const payload = {
      queue_id: id,
      queue_hash: queue_hash,
      device_hash: device,
      contact_type: contact_type,
      contact_value: contact_value,
    };

    if (group !== undefined) {
      payload.queue_group = group;
    }

    return axios.post(config.join_queue, payload);
  },
  leaveQueue(id, device) {
    return axios.delete(config.leave_queue + id + "/" + device + "/");
  },
  existInQueue(id, device) {
    return axios.get(
      config.exist_in_queue + "?queue=" + id + "&device=" + device
    );
  },
  updateQueue(id, position, status,name,est,p,cs,st,et) {
    const payload = {
      id: id,
    };
    
    if(position) payload.position=position
    if(status) payload.status=status
    if (name) payload.name=name;
    if (est) payload.estimated_wait_mins=est;
    if (p) payload.prefix=p;
    if (cs) payload.color_settings=cs;
    if (st) payload.start_time=st;
    if(et) payload.end_time=et

    return authInstance.put(config.update_queue, payload, getHeaders());
  },
  enrollDisplay(id, device, passcode) {
    const payload = {
      passcode: passcode,
      device: device,
    };

    return axios.post(config.enroll_display, payload);
  },
  getDisplay(id, device) {
    return axios.get(config.enroll_display + id + "/" + device + "/");
  },
  deleteGroups(id){
    return authInstance.delete(config.delete_groups+id+"/", getHeaders());
  },
  saveSettings(cs){
    const payload={};
    if (cs) payload.color_settings=cs;
    return authInstance.post(config.update_settings,payload,getHeaders());
  },
  getSettings(){
    return authInstance.get(config.get_settings,getHeaders());
  }
};

export default QueueService;
