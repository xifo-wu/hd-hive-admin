import _ from 'lodash';
import { useModal } from '@/lib/hooks';
import { message } from 'antd';
import { ModalForm } from '@ant-design/pro-components';
import { useState } from 'react';
import api from '@/lib/utils/api';
import TVCommonForm from './TVCommonForm';

interface Props {
  title?: string;
  recordType: string;
  modalName?: string;
  onFinish?: (values: any) => void;
}

const CreateTVModalForm = ({
  onFinish,
  title,
  recordType,
  modalName = 'CreateTVModalForm',
}: Props) => {
  const { open, params, closeModal } = useModal<any>(modalName);
  const [genres] = useState<string[]>(params?.genre_names || []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(modalName);
    }
  };

  const handleFinish = async (values: any) => {
    const seasons = _.map(params?.seasons, (season) => ({
      air_date: season.air_date,
      episode_count: season.episode_count,
      name: season.name,
      overview: season.overview,
      poster_path: season.poster_path,
      season_number: season.season_number,
      tmdb_season_id: season.id,
    }));

    const payload = {
      ...values,
      genre_names: values.genre_names || [],
      tmdb_id: params?.id,
      imdb_id: params?.imdb_id,
      tmdb_url: params?.tmdb_url,
      adult: params?.adult,
      number_of_episodes: params?.number_of_episodes,
      number_of_seasons: params?.number_of_seasons,
      homepage: params?.homepage,
      episode_run_time: params?.episode_run_time,
      origin_country:
        _.get(params, 'origin_country[0]') ||
        _.get(params, 'production_countries[0].iso_3166_1'),
      seasons,
      record_type: recordType,
    };

    console.log(payload);

    const { response, error } = await api.post<any, any>(
      '/api/v1/manager/tv',
      payload,
    );
    if (error) {
      message.error(error.message);
      return;
    }

    onFinish?.(response);
    return true;
  };

  return (
    <ModalForm
      title={title}
      preserve
      open={open}
      layout="vertical"
      onOpenChange={handleOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={params}
      rowProps={{
        gutter: [16, 16],
      }}
      grid
    >
      <TVCommonForm genres={genres} />
    </ModalForm>
  );
};

export default CreateTVModalForm;
