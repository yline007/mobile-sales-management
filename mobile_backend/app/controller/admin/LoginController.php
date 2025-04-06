<?php
declare (strict_types = 1);

namespace app\controller\admin;

use app\BaseController;
use app\model\Admin;
use think\facade\Session;
use think\facade\Config;
use think\Request;
use think\Response;

/**
 * 登录控制器
 * Class LoginController
 * @package app\controller\admin
 */
class LoginController extends BaseController
{
    /**
     * 管理员登录
     *
     * @param Request $request
     * @return Response
     */
    public function login(Request $request): Response
    {
        // 获取登录参数
        $username = $request->param('username');
        $password = $request->param('password');

        // 参数验证
        if (empty($username) || empty($password)) {
            return json(['success' => false, 'message' => '用户名和密码不能为空']);
        }

        // 查询用户
        $admin = Admin::where('username', $username)->find();
        if (!$admin) {
            return json(['success' => false, 'message' => '用户不存在']);
        }

        // 验证密码
        if (md5($password) !== $admin->password) {
            return json(['success' => false, 'message' => '密码错误']);
        }

        // 验证状态
        if ($admin->status != 1) {
            return json(['success' => false, 'message' => '账号已被禁用']);
        }

        // 生成token (简单实现，实际应使用JWT)
        $token = md5($admin->id . time() . uniqid());
        
        // 保存到session
        Session::set('admin_id', $admin->id);
        Session::set('admin_token', $token);

        // 返回用户信息
        return json([
            'success' => true,
            'message' => '登录成功',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $admin->id,
                    'username' => $admin->username,
                    'nickname' => $admin->nickname,
                    'avatar' => $admin->avatar,
                    'role' => $admin->role
                ]
            ]
        ]);
    }

    /**
     * 退出登录
     *
     * @return Response
     */
    public function logout(): Response
    {
        // 清除session
        Session::delete('admin_id');
        Session::delete('admin_token');

        return json(['success' => true, 'message' => '退出成功']);
    }

    /**
     * 获取当前管理员信息
     *
     * @return Response
     */
    public function getInfo(): Response
    {
        // 从session获取管理员ID
        $adminId = Session::get('admin_id');
        if (!$adminId) {
            return json(['success' => false, 'message' => '未登录']);
        }

        // 查询管理员信息
        $admin = Admin::find($adminId);
        if (!$admin) {
            return json(['success' => false, 'message' => '管理员不存在']);
        }

        return json([
            'success' => true,
            'data' => [
                'id' => $admin->id,
                'username' => $admin->username,
                'nickname' => $admin->nickname,
                'avatar' => $admin->avatar,
                'email' => $admin->email,
                'role' => $admin->role,
                'createTime' => $admin->create_time,
                'updateTime' => $admin->update_time
            ]
        ]);
    }
} 