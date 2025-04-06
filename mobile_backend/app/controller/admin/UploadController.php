<?php
declare (strict_types = 1);

namespace app\controller\admin;

use think\facade\Filesystem;
use think\facade\Request;
use think\Response;

class UploadController
{
    /**
     * 文件上传
     * @return Response
     */
    public function index(): Response
    {
        $file = Request::file('file');
        $type = Request::param('type', 'sales'); // 默认为销售记录相关文件

        if (!$file) {
            return json(['code' => 1, 'msg' => '请选择要上传的文件']);
        }

        // 验证文件
        try {
            validate(['file' => [
                'fileSize' => 10 * 1024 * 1024, // 限制大小10M
                'fileExt' => 'jpg,jpeg,png,gif' // 限制文件类型
            ]])->check(['file' => $file]);
        } catch (\think\exception\ValidateException $e) {
            return json(['code' => 1, 'msg' => $e->getMessage()]);
        }

        // 根据类型确定上传目录
        $savePath = '';
        switch ($type) {
            case 'sales':
                $savePath = 'sales';
                break;
            case 'brand':
                $savePath = 'brand';
                break;
            case 'model':
                $savePath = 'model';
                break;
            case 'avatar':
                $savePath = 'avatar';
                break;
            default:
                $savePath = 'other';
        }

        try {
            $saveName = Filesystem::disk('public')->putFile($savePath, $file);
            $url = '/storage/' . $saveName;
            return json([
                'code' => 0,
                'msg' => '上传成功',
                'data' => [
                    'url' => $url
                ]
            ]);
        } catch (\Exception $e) {
            return json(['code' => 1, 'msg' => '上传失败：' . $e->getMessage()]);
        }
    }
} 