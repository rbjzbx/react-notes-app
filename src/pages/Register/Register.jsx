import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { registerUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await registerUser(values);
      setUser(response.data); // 设置用户信息
      alert('注册成功');
      navigate('/login'); // 跳转到登录页面
    } catch (error) {
      console.error('Registration failed:', error);
      alert('注册失败，请重试');
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* 诗词背景 - 布满全屏 */}
      <div
        className="absolute inset-0 font-serif text-black flex justify-center items-center"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontSize: '28px',
          lineHeight: '2',
          padding: '2rem',
          zIndex: 0,
          overflowY: 'auto'
        }}
      >
        <div className="max-h-full">
          <h4 style={{ fontSize: '26px', marginBottom: '2rem', fontWeight: 'bold' }}>
            唐·王勃《滕王阁序》
          </h4>
          <p style={{ 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            fontFamily: '"华文楷体", "KaiTi", "STKaiti", serif'
          }}>
            豫章故郡，洪都新府。星分翼轸，地接衡庐。襟三江而带五湖，控蛮荆而引瓯越。物华天宝，龙光射牛斗之墟；人杰地灵，徐孺下陈蕃之榻。雄州雾列，俊采星驰。台隍枕夷夏之交，宾主尽东南之美。都督阎公之雅望，棨戟遥临；宇文新州之懿范，襜帷暂驻。十旬休假，胜友如云；千里逢迎，高朋满座。腾蛟起凤，孟学士之词宗；紫电青霜，王将军之武库。家君作宰，路出名区；童子何知，躬逢胜饯。(豫章故郡 一作：南昌故郡；青霜 一作：清霜)

            时维九月，序属三秋。潦水尽而寒潭清，烟光凝而暮山紫。俨骖騑于上路，访风景于崇阿。临帝子之长洲，得天人之旧馆。层峦耸翠，上出重霄；飞阁流丹，下临无地。鹤汀凫渚，穷岛屿之萦回；桂殿兰宫，即冈峦之体势。（天人 一作：仙人；层峦 一作：层台；即冈 一作：列冈；飞阁流丹 一作：飞阁翔丹）

            披绣闼，俯雕甍，山原旷其盈视，川泽纡其骇瞩。闾阎扑地，钟鸣鼎食之家；舸舰迷津，青雀黄龙之舳。云销雨霁，彩彻区明。落霞与孤鹜齐飞，秋水共长天一色。渔舟唱晚，响穷彭蠡之滨，雁阵惊寒，声断衡阳之浦。(迷津 一作：弥津；云销雨霁，彩彻区明 一作：虹销雨霁，彩彻云衢)

            遥襟甫畅，逸兴遄飞。爽籁发而清风生，纤歌凝而白云遏。睢园绿竹，气凌彭泽之樽；邺水朱华，光照临川之笔。四美具，二难并。穷睇眄于中天，极娱游于暇日。天高地迥，觉宇宙之无穷；兴尽悲来，识盈虚之有数。望长安于日下，目吴会于云间。地势极而南溟深，天柱高而北辰远。关山难越，谁悲失路之人；萍水相逢，尽是他乡之客。怀帝阍而不见，奉宣室以何年？(遥襟甫畅 一作：遥吟俯畅)

            嗟乎！时运不齐，命途多舛。冯唐易老，李广难封。屈贾谊于长沙，非无圣主；窜梁鸿于海曲，岂乏明时？所赖君子见机，达人知命。老当益壮，宁移白首之心？穷且益坚，不坠青云之志。酌贪泉而觉爽，处涸辙以犹欢。北海虽赊，扶摇可接；东隅已逝，桑榆非晚。孟尝高洁，空余报国之情；阮籍猖狂，岂效穷途之哭！(见机 一作：安贫；以犹欢 一作：而相欢)

            勃，三尺微命，一介书生。无路请缨，等终军之弱冠；有怀投笔，慕宗悫之长风。舍簪笏于百龄，奉晨昏于万里。非谢家之宝树，接孟氏之芳邻。他日趋庭，叨陪鲤对；今兹捧袂，喜托龙门。杨意不逢，抚凌云而自惜；钟期既遇，奏流水以何惭？

            呜呼！胜地不常，盛筵难再；兰亭已矣，梓泽丘墟。临别赠言，幸承恩于伟饯；登高作赋，是所望于群公。敢竭鄙怀，恭疏短引；一言均赋，四韵俱成。请洒潘江，各倾陆海云尔。
            滕王高阁临江渚，佩玉鸣鸾罢歌舞。
            画栋朝飞南浦云，珠帘暮卷西山雨。
            闲云潭影日悠悠，物换星移几度秋。
            阁中帝子今何在？槛外长江空自流。
          </p>
        </div>
      </div>

      {/* 注册表单 - 居中悬浮 */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full">
        {/* 新增应用标题 */}
        <div className="mb-8 text-center">
          <Text className="text-8xl font-bold text-white drop-shadow-lg" style={{ 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            fontFamily: '"华文楷体", "KaiTi", "STKaiti", serif'
          }}>
            笔记应用
          </Text>
        </div>

        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-96 backdrop-filter backdrop-blur-sm">
          <Title level={2} className="text-center mb-6">
            注册
          </Title>
          <Form onFinish={onFinish} className="space-y-6">
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: '请输入邮箱！' }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" className="w-full py-4" htmlType="submit">
                注册
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center mt-4">
            已经有账号？
            <a href="/login">去登录</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;