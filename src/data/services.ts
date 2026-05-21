/** 4-step service process displayed on the homepage "Our Services" timeline.
 *  Replace text with Art Color's actual onboarding process when ready. */
export interface ServiceStep {
  title: string;
  desc: string;
}

export const services: ServiceStep[] = [
  {
    title: 'Tìm hiểu\n& Khảo sát',
    desc: 'Bắt đầu từ không gian, đối tượng sử dụng và tầm nhìn của bạn — thu thập mọi thông tin cần thiết để thiết kế giải pháp phù hợp.',
  },
  {
    title: 'Concept\n& Thiết kế',
    desc: 'Đội ngũ phát triển concept không gian, lựa chọn thiết bị, layout và luồng vận hành — tối ưu cho brand của bạn.',
  },
  {
    title: 'Cung cấp\n& Lắp đặt',
    desc: 'Procure và lắp đặt thiết bị với độ chính xác cao. Mọi brand chúng tôi phân phối đều có chứng nhận toàn cầu.',
  },
  {
    title: 'Đào tạo\n& Hỗ trợ',
    desc: 'Đào tạo đội ngũ của bạn và cung cấp hỗ trợ liên tục — bảo trì, hướng dẫn nhân viên, thiết kế chương trình tập.',
  },
];
