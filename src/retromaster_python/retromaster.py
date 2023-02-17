import zulip
import random


class Retromaster(object):
    '''
      This bot will allow users to randomly pick the host of our biweekly retrospective meetings. 
    '''

    def usage(self):
        return '''It's invoked by errbot every two weeks.'''

    def get_all_subscribers_from_stream(self, bot_handler, stream):
        return bot_handler.get_subscribers(stream=stream)['subscribers']

    def pick_random_user(self, all_users):
        return random.choice(all_users)

    def fetch_user_data(self, bot_handler, random_user):
        return bot_handler.get_user_by_id(random_user)['user']

    def generate_message(sefl, retromaster):
        return 'Our next retro master is @**{name}** 🎉. The expectations are super high!'.format(name=retromaster['full_name'])

    def handle_send_message(self, bot_handler, message):
        request = dict(
            type='stream',
            to=stream,
            subject='Retrospective',
            content=message,
        )
        bot_handler.send_message(request)


handler_class = Retromaster


bot_handler = zulip.Client(config_file="~/.zuliprc")
stream = 'test'
retromaster_bot = Retromaster()

all_users = retromaster_bot.get_all_subscribers_from_stream(
    bot_handler, stream)
random_user = retromaster_bot.pick_random_user(all_users)
retromaster = retromaster_bot.fetch_user_data(bot_handler, random_user)
message = retromaster_bot.generate_message(retromaster)

retromaster_bot.handle_send_message(bot_handler, message)
