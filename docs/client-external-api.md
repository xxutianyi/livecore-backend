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

- 所有接口都通过 query 传 `client_id`、`client_secret`。
- `POST` / `DELETE` 接口的 JSON body 只放业务字段。

## Actor

`{actor}` 是后台“影子用户”的用户 ID。

影子用户要求：

- `account_type = service`
- `role = room-admin`
- 通过后台“影子用户”面板授权直播间

当前版本暂不限制 `client` 和影子用户绑定关系。

## 全量查询观众

```http
GET /api/client/audiences?client_id={client_id}&client_secret={client_secret}
```

返回系统内全部观众，用于调用方存量拉取和同步。此接口只校验 client 凭证和 IP 白名单，不需要 actor 授权。
此接口不会返回 `password`。

返回：

```json
{
  "code": 0,
  "data": [
    {
      "id": "019f2d8a-c816-73fa-9dbf-89eee0aa08d1",
      "name": "Apifox Existing Audience Updated Again",
      "phone": "13900001001",
      "email": "apifox-existing@example.com",
      "group_ids": ["019f2d8a-c812-72bd-8ef9-b10d4168f19f"]
    }
  ],
  "message": "success",
  "errors": null
}
```

本地验证时该接口返回 `code = 0`，共 6 条观众数据。

## 查询观众可访问直播间

```http
GET /api/client/audiences/{audience}/rooms?client_id={client_id}&client_secret={client_secret}
```

`{audience}` 是本系统观众用户 ID。

返回该观众通过所属分组可访问的直播间列表。此接口只校验 client 凭证和 IP 白名单，不需要 actor 授权。非观众用户会返回权限不足。

返回：

```json
{
  "code": 0,
  "data": [
    {
      "id": "room-uuid",
      "name": "直播间名称",
      "description": "直播间描述",
      "cover": "https://example.com/cover.jpg"
    }
  ],
  "message": "success",
  "errors": null
}
```

## 查询观众观看记录

```http
GET /api/client/audiences/{audience}/viewing-records?client_id={client_id}&client_secret={client_secret}
```

`{audience}` 是本系统观众用户 ID。

返回该观众的观看记录，数据来自用户进入直播间时创建的记录。结果按 `joined_at` 倒序排列；同一时间的记录再按 ID 倒序排列。每条记录包含直播间和直播场次的基础信息。

此接口只校验 client 凭证和 IP 白名单，不需要 actor 授权。非观众用户会返回权限不足（`code = 4000`）。

返回：

```json
{
  "code": 0,
  "data": [
    {
      "id": "online-uuid",
      "living": false,
      "user_id": "audience-uuid",
      "room_id": "room-uuid",
      "event_id": "event-uuid",
      "joined_at": "2026-08-24T10:00:00.000000Z",
      "leaving_at": "2026-08-24T11:00:00.000000Z",
      "created_at": "2026-08-24T10:00:00.000000Z",
      "updated_at": "2026-08-24T11:00:00.000000Z",
      "room": {
        "id": "room-uuid",
        "name": "直播间名称"
      },
      "event": {
        "id": "event-uuid",
        "name": "直播场次名称"
      }
    }
  ],
  "message": "success",
  "errors": null
}
```

## 查询观众评论记录

```http
GET /api/client/audiences/{audience}/comment-records?client_id={client_id}&client_secret={client_secret}
```

`{audience}` 是本系统观众用户 ID。

返回该观众提交的全部评论记录（包含尚未审核发布的评论），按 `created_at` 倒序排列；同一时间的记录再按 ID 倒序排列。每条记录包含直播间和直播场次的基础信息。

此接口只校验 client 凭证和 IP 白名单，不需要 actor 授权。非观众用户会返回权限不足（`code = 4000`）。

返回：

```json
{
  "code": 0,
  "data": [
    {
      "id": "message-uuid",
      "content": "这场直播很精彩",
      "room_id": "room-uuid",
      "event_id": "event-uuid",
      "sender_id": "audience-uuid",
      "created_at": "2026-08-24T10:30:00.000000Z",
      "room": {
        "id": "room-uuid",
        "name": "直播间名称"
      },
      "event": {
        "id": "event-uuid",
        "name": "直播场次名称"
      }
    }
  ],
  "message": "success",
  "errors": null
}
```

## 重置观众密码

```http
POST /api/client/audiences/{audience}/password/reset?client_id={client_id}&client_secret={client_secret}
```

`{audience}` 是本系统观众用户 ID。

将指定观众的密码重置为固定值 `Password!@`，并在本次响应中返回该明文密码。此接口只校验 client 凭证和 IP 白名单，不需要 actor 授权。非观众用户会返回权限不足。

返回：

```json
{
  "code": 0,
  "data": {
    "id": "user-uuid",
    "user_id": "user-uuid",
    "name": "观众名称",
    "phone": "13800000000",
    "email": "user@example.com",
    "group_ids": ["group-uuid"],
    "password": "Password!@"
  },
  "message": "success",
  "errors": null
}
```

## 获取用户 Token

```http
POST /api/client/token/{user}?client_id={client_id}&client_secret={client_secret}
```

`{user}` 是本系统用户 ID。

为指定用户签发短期访问 token。此接口只校验 client 凭证和 IP 白名单，不需要 actor 授权。

返回：

```json
{
  "code": 0,
  "data": {
    "token": "70|plain-text-token",
    "expires_in": 300,
    "user": {
      "id": "user-uuid",
      "name": "用户名称"
    }
  },
  "message": "success",
  "errors": null
}
```

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
POST /api/client/actors/{actor}/audiences/upsert?client_id={client_id}&client_secret={client_secret}
```

请求：

```json
{
  "name": "观众名称",
  "phone": "13800000000",
  "email": "user@example.com",
  "group_ids": ["group-uuid"]
}
```

规则：

- 系统会使用 `name`、`phone`、`email` 作为唯一标识匹配已有用户。
- 用户不存在时创建 `audience`，并在响应中返回本系统用户 ID 和固定明文密码 `Password!@`。
- 用户存在时只更新基础字段，并返回同一个本系统用户 ID，不返回密码。
- 如果 `name`、`phone`、`email` 分别匹配到多个不同用户，请求会被拒绝。
- `group_ids` 必须全部在 actor 可管理分组内。
- 只附加本次传入的分组，不覆盖用户已有其他分组。
- 返回的 `group_ids` 是操作后该用户的完整分组 ID 列表。

成功响应中的 `data.id` / `data.user_id` 即本系统观众用户 ID，后续附加/分离分组接口的 `{audience}` 使用这个 ID。

返回：

```json
{
  "code": 0,
  "data": {
    "id": "user-uuid",
    "user_id": "user-uuid",
    "name": "观众名称",
    "phone": "13800000000",
    "email": "user@example.com",
    "group_ids": ["group-uuid"],
    "password": "Password!@"
  },
  "message": "success",
  "errors": null
}
```

## 附加观众分组

```http
POST /api/client/actors/{actor}/audiences/{audience}/groups/attach?client_id={client_id}&client_secret={client_secret}
```

请求：

```json
{
  "group_ids": ["group-uuid"]
}
```

只附加 actor 可管理的分组，不覆盖其他分组。

返回格式同“新建或更新观众并附加分组”，`data.group_ids` 是附加后该用户的完整分组 ID 列表。

此接口不会返回 `password`。

## 分离观众分组

```http
DELETE /api/client/actors/{actor}/audiences/{audience}/groups/detach?client_id={client_id}&client_secret={client_secret}
```

请求：

```json
{
  "group_ids": ["group-uuid"]
}
```

只移除 actor 可管理且本次指定的分组，不影响用户已有其他分组。

返回格式同“新建或更新观众并附加分组”，`data.group_ids` 是分离后该用户的完整分组 ID 列表。

此接口不会返回 `password`。

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
