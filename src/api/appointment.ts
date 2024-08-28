import type { AppointmentItem } from '@/types/home'
import { http } from '@/utils/http'
import type { Appointment } from '@/types/appointment'

// 预约
export const makeAnAppointmentAPI = (data: Appointment) => {
  return http({
    method: 'POST',
    url: '/appointment/make',
    data,
  })
}

// 获取预约列表
export const getAppointmentListAPI = (status: number) => {
  return http<AppointmentItem[]>({
    method: 'GET',
    url: `/appointment/list?status=${status}`,
  })
}

// 取消预约
export const cancelAppointmentAPI = (id: number, status: number) => {
  return http({
    method: 'PUT',
    url: `/appointment/cancel?id=${id}&status=${status}`,
  })
}

// 删除预约
export const deleteAppointmentAPI = (id: number, status: number) => {
  return http({
    method: 'DELETE',
    url: `/appointment/delete?id=${id}&status=${status}`,
  })
}
