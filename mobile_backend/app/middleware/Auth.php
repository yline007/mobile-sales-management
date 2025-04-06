<?php
declare (strict_types = 1);

namespace app\middleware;

use app\model\Admin;
use think\facade\Session;
use think\Request;
use think\Response;

/**
 * 身份验证中间件
 * Class Auth
 * @package app\middleware
 */
class Auth
{
    /**
     * 处理请求
     *
     * @param Request $request
     * @param \Closure $next
     * @return Response
     */
    public function handle(Request $request, \Closure $next): Response
    {
        // 获取请求头中的token或从会话获取
        $token = $request->header('Authorization');
        if (empty($token)) {
            $token = Session::get('admin_token');
        }
        
        // 如果没有token，返回未授权
        if (empty($token)) {
            return json(['success' => false, 'message' => '未登录或登录已过期'], 401);
        }
        
        // 从session获取管理员ID
        $adminId = Session::get('admin_id');
        if (empty($adminId)) {
            return json(['success' => false, 'message' => '未登录或登录已过期'], 401);
        }
        
        // 查询管理员信息
        $admin = Admin::find($adminId);
        if (!$admin) {
            return json(['success' => false, 'message' => '管理员不存在'], 401);
        }
        
        // 判断管理员状态
        if ($admin->status != 1) {
            return json(['success' => false, 'message' => '账号已被禁用'], 403);
        }
        
        // 将管理员信息附加到请求对象
        $request->adminInfo = $admin;
        
        return $next($request);
    }
} 