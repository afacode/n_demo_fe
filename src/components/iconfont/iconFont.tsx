import { createFromIconfontCN } from '@ant-design/icons-vue';
import { defineComponent, unref, computed } from 'vue';
import type { PropType } from 'vue';

let scriptUrls = ['https://buqiyuan.gitee.io/vue3-antdv-admin/iconfont.js'];
// let scriptUrls = [`${import.meta.env.BASE_URL}iconfont.js`];

const MyIconFont = createFromIconfontCN({
  scriptUrl: scriptUrls, // 在 iconfont.cn 上生成
});

export default defineComponent({
  name: 'IconFont',
  props: {
    type: {
      type: String as PropType<string>,
      default: '',
    },
    prefix: {
      type: String,
      default: 'icon-',
    },
    color: {
      type: String as PropType<string>,
      default: 'unset',
    },
    size: {
      type: [Number, String] as PropType<number | string>,
      default: 14,
    },
    scriptUrl: {
      // 阿里图库字体图标路径
      type: String as PropType<string | string[]>,
      default: '',
    },
  },
  setup(props, { attrs }) {
    if (props.scriptUrl) {
      scriptUrls = [...new Set(scriptUrls.concat(props.scriptUrl))];
      MyIconFont = createFromIconfontCN({
        scriptUrl: scriptUrls,
      });
    }

    const wrapStyleRef = computed(() => {
      const { color, size } = props;

      const fs = size;
      // const fs = isString(size) ? parseFloat(size) : size;

      return {
        color,
        fontSize: `${fs}px`,
      };
    });

    return () => {
      const { type, prefix } = props;
      return type ? (
        <MyIconFont
          type={type.startsWith(prefix) ? type : `${prefix}${type}`}
          {...attrs}
          style={unref(wrapStyleRef)}
        />
      ) : null;
    };
  },
});