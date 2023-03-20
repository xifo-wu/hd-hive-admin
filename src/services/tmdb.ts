import _ from 'lodash';
import { message } from 'antd';
import { tmdbUrlRegex } from '@/lib/utils/tmdb';
import api from '@/lib/utils/api';

const typeI18n = {
  tv: '剧集',
  movie: '电影',
};

interface Options {
  onlyType?: 'tv' | 'movie';
}

/**
 * 通过 tmdb 的链接获取到具体内容的详情
 * @param tmdbUrl tmdb 的网址
 */
export const getTmdbDetail = async (tmdbUrl: string, options?: Options) => {
  const match = tmdbUrl.match(tmdbUrlRegex);
  if (!match) {
    // 匹配失败
    message.error('TMDb URL 解析失败');
    return;
  }

  // 匹配成功
  // 获取电影或电视节目的类型
  const type = match[1];
  // 获取电影或电视节目的ID
  const id = match[2];

  if (options && options.onlyType && options.onlyType !== type) {
    message.error(`只能添加${typeI18n[options.onlyType]}哦`);
    return;
  }

  try {
    const data = await api.get<any, any>(`/api/v1/tmdb/${type}/${id}`);

    const genreNames = (data.genres || []).map((item: any) => item.name);
    const poster_path = _.chain(data)
      .get('images.posters') // @ts-ignore
      .find((i: any) => i.iso_639_1 === 'en')
      .get('file_path')
      .value();

    const logo_path =
      _.chain(data)
        .get('images.logos') // @ts-ignore
        .find((i: any) => i.iso_639_1 === 'zh')
        .get('file_path')
        .value() ||
      _.get(data, 'images.logos[0].file_path') ||
      '';

    const keywords = [`#${data.title}`].concat(
      (data.genres || []).map((item: any) => `#${item.name}`),
    );

    const params = {
      ...data,
      genre_names: genreNames,
      overview: (data.overview || '').replaceAll('\r', ''),
      // 因英文海报更简洁，故优先取英文海报
      poster_path: poster_path || data.poster_path,
      logo_path,
      tmdb_type: type,
      tmdb_id: id,
      keywords,
    };

    message.success('获取资料成功 🎉');
    return params;
  } catch (error: any) {
    message.warning(error.message);
    return;
  }
};
