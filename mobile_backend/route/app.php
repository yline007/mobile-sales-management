<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\facade\Route;

// 添加api路由分组
Route::group('api', function () {
    // 登录相关路由
    Route::post('login', 'admin.Login/login');
    Route::get('admin/info', 'admin.Login/getInfo')->middleware('app\middleware\Auth');
    Route::post('admin/logout', 'admin.Login/logout')->middleware('app\middleware\Auth');
    Route::post('admin/password/update', 'admin.Login/updatePassword')->middleware('app\middleware\Auth');

    // 仪表盘相关路由
    Route::get('admin/dashboard/statistics', 'admin.Dashboard/statistics')->middleware('app\middleware\Auth');
    Route::post('admin/dashboard/salesTrend', 'admin.Dashboard/salesTrend')->middleware('app\middleware\Auth');
    Route::get('admin/dashboard/brandStatistics', 'admin.Dashboard/brandStatistics')->middleware('app\middleware\Auth');
    Route::get('admin/dashboard/storeStatistics', 'admin.Dashboard/storeStatistics')->middleware('app\middleware\Auth');
    Route::get('admin/dashboard/latestSalesRecords', 'admin.Dashboard/latestSalesRecords')->middleware('app\middleware\Auth');

    // 管理员相关路由
    Route::group('admin/user', function () {
        Route::get('', 'admin.Admin/index');
        Route::post('', 'admin.Admin/create');
        Route::put(':id', 'admin.Admin/update');
        Route::delete(':id', 'admin.Admin/delete');
        Route::post(':id/status', 'admin.Admin/updateStatus');
    })->middleware('app\middleware\Auth');

    // 销售记录相关路由
    Route::group('admin/sales', function () {
        Route::get('', 'admin.Sales/index');
        Route::post('', 'admin.Sales/create');
        Route::put(':id', 'admin.Sales/update');
        Route::delete(':id', 'admin.Sales/delete');
        Route::get(':id', 'admin.Sales/detail');
    })->middleware('app\middleware\Auth');

    // 门店相关路由
    Route::group('admin/store', function () {
        Route::get('', 'admin.Store/index');
        Route::post('', 'admin.Store/create');
        Route::put(':id', 'admin.Store/update');
        Route::delete(':id', 'admin.Store/delete');
        Route::post(':id/status', 'admin.Store/updateStatus');
    })->middleware('app\middleware\Auth');

    // 销售员相关路由
    Route::group('admin/salesperson', function () {
        Route::get('', 'admin.Salesperson/index');
        Route::post('', 'admin.Salesperson/create');
        Route::put(':id', 'admin.Salesperson/update');
        Route::delete(':id', 'admin.Salesperson/delete');
        Route::post(':id/status', 'admin.Salesperson/updateStatus');
    })->middleware('app\middleware\Auth');

    // 手机品牌相关路由
    Route::group('admin/phone/brand', function () {
        Route::get('', 'admin.Phone/brandList');
        Route::post('', 'admin.Phone/createBrand');
        Route::put(':id', 'admin.Phone/updateBrand');
        Route::delete(':id', 'admin.Phone/deleteBrand');
    })->middleware('app\middleware\Auth');

    // 手机型号相关路由
    Route::group('admin/phone/model', function () {
        Route::get('', 'admin.Phone/modelList');
        Route::post('', 'admin.Phone/createModel');
        Route::put(':id', 'admin.Phone/updateModel');
        Route::delete(':id', 'admin.Phone/deleteModel');
    })->middleware('app\middleware\Auth');

    // 系统设置相关路由
    Route::group('admin/system/setting', function () {
        Route::get('', 'admin.System/getSettings');
        Route::post('', 'admin.System/updateSettings');
    })->middleware('app\middleware\Auth');

    // 文件上传路由
    Route::post('upload', 'admin.Upload/index')->middleware('app\middleware\Auth');
});
