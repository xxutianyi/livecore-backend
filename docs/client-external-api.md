# 外部 Client API

## 认证

所有接口都放在 `/api/client` 下，使用现有 `client` 中间件认证。

请求必须带现有 client 凭证参数：

```json
{
  "client_id": "client-uuid",
  "client_secret": "client-secret"
}
```

服务端仍会校验 client secret 和 IP 白名单。

- `GET` 接口通过 query 传 `client_id`、`client_secret`。
- `POST` / `DELETE` 接口通过 JSON body 传 `client_id`、`client_secret`。

## Actor

`{actor}` 是后台“影子用户”的用户 ID。

影子用户要求：

- `account_type = service`
- `role = room-admin`
- 通过后台“影子用户”面板授权直播间

当前版本暂不限制 `client` 和影子用户绑定关系。

## 查询授权直播间

```http
GET /api/client/actors/{actor}/rooms?client_id={client_id}&client_secret={client_secret}
```

返回 actor 被授权管理的直播间列表。

## 查询授权观众分组

```http
GET /api/client/actors/{actor}/groups?client_id={client_id}&client_secret={client_secret}
```

返回 actor 可管理的观众分组。可管理分组由“actor 授权直播间 -> 直播间关联分组”推导。

## 新建或更新观众并附加分组

```http
POST /api/client/actors/{actor}/audiences/upsert
```

请求：

```json
{
  "client_id": "client-uuid",
  "client_secret": "client-secret",
  "external_id": "external-user-id",
  "name": "观众名称",
  "phone": "13800000000",
  "email": "user@example.com",
  "group_ids": ["group-uuid"]
}
```

规则：

- `external_id` 是外部系统用户唯一标识，必填。
- 用户不存在时创建 `audience`。
- 用户存在时只更新基础字段。
- `group_ids` 必须全部在 actor 可管理分组内。
- 只附加本次传入的分组，不覆盖用户已有其他分组。
- 返回只包含本次请求涉及的 `group_ids`，不返回用户完整分组。

## 附加观众分组

```http
POST /api/client/actors/{actor}/audiences/{audience}/groups/attach
```

请求：

```json
{
  "client_id": "client-uuid",
  "client_secret": "client-secret",
  "group_ids": ["group-uuid"]
}
```

只附加 actor 可管理的分组，不覆盖其他分组。

## 分离观众分组

```http
DELETE /api/client/actors/{actor}/audiences/{audience}/groups/detach
```

请求：

```json
{
  "client_id": "client-uuid",
  "client_secret": "client-secret",
  "group_ids": ["group-uuid"]
}
```

只移除 actor 可管理且本次指定的分组，不影响用户已有其他分组。

## 响应格式

成功：

```json
{
  "code": 0,
  "data": {},
  "message": "success",
  "errors": null
}
```

权限不足：

```json
{
  "code": 4000,
  "data": null,
  "message": "权限不足",
  "errors": null
}
```

验证失败：

```json
{
  "code": 4003,
  "data": null,
  "message": "提交的数据验证失败",
  "errors": {
    "group_ids": ["用户分组不正确"]
  }
}
```
