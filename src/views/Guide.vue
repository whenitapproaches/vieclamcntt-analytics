<template>
	<section>
		<div class="box">
			<div class="content">
				<h3 class="title">Hướng dẫn chung</h3>
				<p>
					1. Tạo một ứng dụng Facebook tại
					<a
						href="#"
						@click.prevent="openExternalLink('https://developers.facebook.com/apps')"
					>đây</a>
				</p>
				<p>
					2. Vào phần
					<b>Cài đặt</b> của phần mềm thiết lập id của group của bạn (lấy ở phần link của trình duyệt hoặc nếu tên group của bạn đã được đổi dạng thì nhập đường link nhóm tại
					<a
						href="#"
						@click.prevent="openExternalLink('https://lookup-id.com/')"
					>đây</a> để lấy)
				</p>
				<p>
					3. Lấy và nhập
					<b>access token</b> và cập nhật
				</p>
				<p>
					4. Vào phần
					<b>Từ khóa</b> để thiết lập các từ khóa để phần mềm có thể quét
				</p>
				<p>
					5. Ở phần
					<b>Bài đăng</b>, chọn khoảng thời gian bạn muốn lấy các bài đăng và bấm
					<b>Lấy bài đăng</b>
				</p>
				<p>
					6. Chọn
					<b>Quét</b> để phần mềm tự động quét nội dung và xuất ra dữ liệu để thống kê
				</p>
				<p>
					7. Ở phần
					<b>Thống kê</b>, bạn sẽ thấy các đơn tuyển dụng đã được quét, ở đây bạn có thể chỉnh sửa hoặc xóa tùy ý
				</p>
				<p>8. Ở đây, bạn có thể tìm kiếm, sắp xếp và lọc theo ngày tháng tùy ý</p>
				<p>
					9.
					<b>Xuất Excel</b> (lưu ý: excel sẽ được xuất dựa trên dữ liệu được lấy từ bảng thống kê,
					<b>kể cả đã lọc theo tìm kiếm hoặc ngày tháng</b>)
				</p>
				<p>Lưu ý: yêu cầu bạn phải là admin của group thì mới có thể lấy được bài đăng</p>
			</div>
		</div>
		<div class="box">
			<div class="content">
				<h3 class="title">Từ khóa</h3>
				<p>
					Thuật toán quét tự động sẽ trả về tên đơn vị tuyển dụng dựa trên các từ khóa
					<b>Đơn vị tuyển dụng</b> bạn đã thêm
				</p>
				<p>
					Nhu cầu tuyển dụng sẽ quét theo dạng: [
					<b>tiền tố số lượng</b>][
					<b>số lượng</b>][
					<b>hậu tố số lượng</b>][
					<b>các từ khóa Nhu cầu tuyển dụng</b>]
				</p>
				<p>
					<b>Lưu ý</b>: không bỏ sót từ khóa (ví dụ: VueJS và vue.js), phải nhập cả hai, từ khóa không quan trọng chữ hoa hay thường (ví dụ: VueJS hay vuejs đều được)
				</p>
			</div>
		</div>
	</section>
</template>

<script>
import { shell } from "electron"
export default {
	methods: {
		openExternalLink(link) {
			shell.openExternal(link)
		},
	},
}
</script>

<style>
</style>